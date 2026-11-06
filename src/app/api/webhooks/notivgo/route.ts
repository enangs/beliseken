export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getNotivGoOrder, verifyNotivGoSignature } from "@/lib/notivgo";
import { markOrderPaidByNumber } from "@/lib/payment-confirmation";

const MAX_CLOCK_SKEW_SECONDS = 300;
const MATCH_ATTEMPTS = 3;
const MATCH_DELAY_MS = 1500;
const MATCH_BUDGET_MS = 8000;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * POST /api/webhooks/notivgo
 *
 * Menerima kiriman dari HP (NotivGo) saat ada notifikasi uang masuk.
 * Kiriman hanya memicu pengecekan ulang; status "paid" diambil dari API
 * NotivGo (pencocokan resmi), bukan dari teks notifikasi.
 *
 * Signature: X-Signature = "sha256=" + HMAC-SHA256(secret, `${ts}.${nonce}.${rawBody}`)
 */
export async function POST(request: NextRequest) {
  // Wajib raw body — spasi sekecil apa pun mengubah tanda tangan.
  const rawBody = await request.text();

  const signatureCheck = verifyNotivGoSignature(rawBody, {
    timestamp: request.headers.get("x-timestamp"),
    nonce: request.headers.get("x-nonce"),
    signature: request.headers.get("x-signature"),
  });

  if (!signatureCheck.valid) {
    if (signatureCheck.reason === "missing_config") {
      console.error("[NotivGo] NOTIVGO_WEBHOOK_SECRET belum diset");
      return NextResponse.json(
        { error: "webhook_secret_missing" },
        { status: 500 }
      );
    }

    console.warn(
      `[NotivGo] Webhook ditolak (${signatureCheck.reason})`
    );
    return NextResponse.json({ error: "invalid_signature" }, { status: 401 });
  }

  // Anti replay
  const nowSeconds = Math.floor(Date.now() / 1000);
  const timestamp = Number(request.headers.get("x-timestamp"));
  if (
    !Number.isFinite(timestamp) ||
    Math.abs(nowSeconds - timestamp) > MAX_CLOCK_SKEW_SECONDS
  ) {
    return NextResponse.json(
      { error: "clock_skew", server_time: nowSeconds },
      { status: 401 }
    );
  }

  let payload: any;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "bad_json" }, { status: 400 });
  }

  // Kiriman contoh dari portal
  if (payload?.event === "webhook.test") {
    return NextResponse.json({ ok: true, test: true });
  }

  const amount = Number(payload?.amount);
  if (
    payload?.direction !== "in" ||
    !Number.isFinite(amount) ||
    amount <= 0
  ) {
    // Bukan uang masuk / nominal tidak terbaca — tidak perlu ditindaklanjuti.
    return NextResponse.json({ ok: true, ignored: true });
  }

  // Cari pesanan NotivGo yang masih menunggu dan nominalnya sama.
  const candidates = (await prisma.$queryRawUnsafe(
    `SELECT "orderNumber", "paymentRef" FROM orders
     WHERE "paymentProvider" = 'NOTIVGO'
       AND LOWER("status") = 'waiting_payment'
       AND "total" = $1
     ORDER BY "createdAt" ASC
     LIMIT 5`,
    amount
  )) as any[];

  if (!candidates || candidates.length === 0) {
    return NextResponse.json({ ok: true, ignored: true, matched: 0 });
  }

  const startedAt = Date.now();
  let confirmed = 0;
  let stillOpen = 0;

  for (let attempt = 1; attempt <= MATCH_ATTEMPTS; attempt++) {
    confirmed = 0;
    stillOpen = 0;

    for (const candidate of candidates) {
      let orderRef: string | null = null;
      try {
        orderRef =
          JSON.parse(candidate.paymentRef || "{}")?.notivgoOrderRef || null;
      } catch {}

      if (!orderRef) continue;

      try {
        const gatewayOrder = await getNotivGoOrder(orderRef);

        if (gatewayOrder.status === "paid") {
          const ok = await markOrderPaidByNumber(candidate.orderNumber, {
            method: "qris",
            amount,
          });
          if (ok) confirmed++;
        } else if (gatewayOrder.status === "open") {
          stillOpen++;
        }
      } catch (error: any) {
        console.error(
          `[NotivGo] Cek pesanan ${orderRef} gagal:`,
          error?.message || error
        );
      }
    }

    if (confirmed > 0 || stillOpen === 0) break;
    if (Date.now() - startedAt + MATCH_DELAY_MS > MATCH_BUDGET_MS) break;

    // Server NotivGo mungkin belum selesai mencocokkan notifikasi.
    await sleep(MATCH_DELAY_MS);
  }

  if (confirmed > 0) {
    console.log(
      `[NotivGo] Pembayaran Rp${amount} dikonfirmasi untuk ${confirmed} pesanan`
    );
    return NextResponse.json({ ok: true, confirmed });
  }

  if (stillOpen > 0) {
    // Minta HP mengirim ulang nanti (5xx = dicoba ulang otomatis).
    return NextResponse.json(
      { ok: false, error: "order_not_matched_yet", pending: stillOpen },
      { status: 503 }
    );
  }

  return NextResponse.json({ ok: true, confirmed: 0 });
}

/**
 * GET /api/webhooks/notivgo — health check
 */
export async function GET() {
  return NextResponse.json({ status: "ok", provider: "notivgo" });
}
