// ══════════════════════════════════════════════════════════════
// NotivGo Payment Gateway Client (QRIS dinamis)
// Docs: https://portal.notivgo.com/docs
//
// Alur:
//   1. POST /v1/generate  → QRIS bernominal (sekaligus buat pesanan
//      pendamping dengan create_order:true agar pembayaran dipantau)
//   2. GET  /v1/orders/{order_ref} → status open | paid | expired | canceled
//   3. Webhook dari HP (notification.forwarded) hanya memicu pengecekan ulang;
//      status "paid" tetap diambil dari API NotivGo (sumber kebenaran).
//
// Hanya boleh dipakai di server — API key tidak pernah dikirim ke browser.
// ══════════════════════════════════════════════════════════════

import crypto from "crypto";

const NOTIVGO_API_BASE =
  process.env.NOTIVGO_API_BASE || "https://portal.notivgo.com";

const REQUEST_TIMEOUT_MS = 20000;

export type NotivGoOrderStatusValue =
  | "open"
  | "paid"
  | "expired"
  | "canceled"
  | string;

export interface NotivGoQris {
  orderRef: string;
  qrisPayload: string;
  notivgoOrderId?: number;
  orderCreated: boolean;
  metered: boolean;
}

export interface NotivGoOrder {
  orderRef: string;
  amount: number | null;
  status: NotivGoOrderStatusValue;
  paidAt: number | null;
}

export class NotivGoError extends Error {
  status: number;
  code: string;

  constructor(message: string, status = 502, code = "notivgo_error") {
    super(message);
    this.name = "NotivGoError";
    this.status = status;
    this.code = code;
  }
}

function getApiKey(): string {
  const apiKey = process.env.NOTIVGO_API_KEY;
  if (!apiKey) {
    throw new NotivGoError(
      "NOTIVGO_API_KEY belum diset di environment",
      500,
      "config_missing"
    );
  }
  return apiKey;
}

async function notivgoRequest(
  path: string,
  init: { method: "GET" | "POST"; body?: string } = { method: "GET" }
): Promise<any> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let res: Response;
  try {
    res = await fetch(`${NOTIVGO_API_BASE}${path}`, {
      method: init.method,
      headers: {
        Authorization: `Bearer ${getApiKey()}`,
        "Content-Type": "application/json",
      },
      body: init.body,
      signal: controller.signal,
      cache: "no-store",
    });
  } catch (error: any) {
    throw new NotivGoError(
      error?.name === "AbortError"
        ? "NotivGo tidak merespons (timeout)"
        : `Gagal menghubungi NotivGo: ${error?.message || error}`,
      504,
      "network_error"
    );
  } finally {
    clearTimeout(timer);
  }

  const text = await res.text();
  let body: any = null;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = { raw: text };
  }

  if (!res.ok) {
    throw new NotivGoError(
      body?.message || body?.error || `NotivGo error (${res.status})`,
      res.status,
      body?.error || "notivgo_error"
    );
  }

  return body;
}

/**
 * Buat QRIS bernominal sekaligus pesanan pendamping (create_order)
 * agar pembayarannya ikut dipantau oleh server NotivGo.
 *
 * order_ref maksimal 64 karakter; ref ≤ 25 karakter ikut tertulis di QR.
 * Mengirim ulang ref yang sama tidak menagih dua kali.
 */
export async function createNotivGoQris(params: {
  orderRef: string;
  amount: number;
  expiresIn?: number;
  note?: string;
}): Promise<NotivGoQris> {
  const expiresIn =
    params.expiresIn ?? Number(process.env.NOTIVGO_EXPIRES_IN || 3600);

  const payload: Record<string, unknown> = {
    order_ref: params.orderRef,
    amount: String(Math.round(params.amount)),
    currency: "IDR",
    format: "payload",
    create_order: true,
    expires_in: expiresIn,
  };

  if (params.note) payload.note = params.note.slice(0, 200);
  if (process.env.NOTIVGO_QRIS_ID) payload.qris_id = process.env.NOTIVGO_QRIS_ID;
  if (process.env.NOTIVGO_OUTLET_ID) {
    payload.outlet_id = process.env.NOTIVGO_OUTLET_ID;
  }

  const body = await notivgoRequest("/v1/generate", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (!body?.qris_payload) {
    throw new NotivGoError(
      "NotivGo tidak mengembalikan QRIS payload",
      502,
      "no_qris_payload"
    );
  }

  return {
    orderRef: body.order_ref || params.orderRef,
    qrisPayload: body.qris_payload,
    notivgoOrderId:
      typeof body.order_id === "number" ? body.order_id : undefined,
    orderCreated: Boolean(body.order_created),
    metered: Boolean(body.metered),
  };
}

/**
 * Baca status pesanan NotivGo (open | paid | expired | canceled).
 */
export async function getNotivGoOrder(orderRef: string): Promise<NotivGoOrder> {
  const body = await notivgoRequest(
    `/v1/orders/${encodeURIComponent(orderRef)}`,
    { method: "GET" }
  );

  return {
    orderRef: body?.order_ref || orderRef,
    amount: body?.amount ?? null,
    status: body?.status || "open",
    paidAt: body?.paid_at ?? null,
  };
}

/**
 * Batalkan pesanan NotivGo (hanya yang masih open).
 */
export async function cancelNotivGoOrder(orderRef: string): Promise<void> {
  await notivgoRequest(`/v1/orders/${encodeURIComponent(orderRef)}/cancel`, {
    method: "POST",
  });
}

export type NotivGoSignatureResult =
  | { valid: true }
  | {
      valid: false;
      reason: "missing_config" | "missing_headers" | "invalid_signature";
    };

/**
 * Verifikasi tanda tangan webhook NotivGo.
 * Basis: HMAC-SHA256(secret, `${timestamp}.${nonce}.${rawBody}`) → "sha256=<hex>".
 * WAJIB memakai raw body, bukan hasil parse JSON.
 */
export function verifyNotivGoSignature(
  rawBody: string,
  headers: {
    timestamp?: string | null;
    nonce?: string | null;
    signature?: string | null;
  }
): NotivGoSignatureResult {
  const secret = process.env.NOTIVGO_WEBHOOK_SECRET;
  if (!secret) return { valid: false, reason: "missing_config" };

  const { timestamp, nonce, signature } = headers;
  if (!timestamp || !nonce || !signature) {
    return { valid: false, reason: "missing_headers" };
  }

  const expected =
    "sha256=" +
    crypto
      .createHmac("sha256", secret)
      .update(`${timestamp}.${nonce}.${rawBody}`)
      .digest("hex");

  const expectedBuf = Buffer.from(expected);
  const receivedBuf = Buffer.from(signature);
  if (expectedBuf.length !== receivedBuf.length) {
    return { valid: false, reason: "invalid_signature" };
  }

  return crypto.timingSafeEqual(expectedBuf, receivedBuf)
    ? { valid: true }
    : { valid: false, reason: "invalid_signature" };
}
