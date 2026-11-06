// ══════════════════════════════════════════════════════════════
// Konfirmasi pembayaran terpusat (idempoten).
// Dipakai oleh route status (polling halaman checkout) dan webhook NotivGo.
// ══════════════════════════════════════════════════════════════

import { prisma } from "@/lib/prisma";

/**
 * Tandai pesanan sebagai sudah dibayar.
 * Aman dipanggil berkali-kali: bila pesanan sudah PAID, tidak ada perubahan.
 *
 * @returns true bila pesanan ada dan sekarang berstatus PAID.
 */
export async function markOrderPaidByNumber(
  orderNumber: string,
  options: { method?: string; amount?: number } = {}
): Promise<boolean> {
  const rows = (await prisma.$queryRawUnsafe(
    `SELECT "id", "orderNumber", "status", "paymentStatus", "total", "addressSnapshot"
     FROM orders WHERE "orderNumber" = $1`,
    orderNumber
  )) as any[];

  if (!rows || rows.length === 0) return false;

  const order = rows[0];
  const alreadyPaid =
    String(order.status || "").toLowerCase() === "paid" ||
    String(order.paymentStatus || "").toUpperCase() === "PAID";

  if (alreadyPaid) return true;

  // Status pesanan memakai huruf kecil ('paid') sesuai konvensi aplikasi,
  // sedangkan paymentStatus memakai huruf besar ('PAID').
  await prisma.$executeRawUnsafe(
    `UPDATE orders
     SET "status" = 'paid',
         "paymentStatus" = 'PAID',
         "paidAt" = COALESCE("paidAt", NOW()),
         "updatedAt" = NOW()
     WHERE "orderNumber" = $1`,
    orderNumber
  );

  const historyId = `osh-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 6)}`;

  await prisma.$executeRawUnsafe(
    `INSERT INTO order_status_logs ("id", "orderId", "status", "note", "createdAt")
     VALUES ($1, $2, 'paid', $3, NOW())`,
    historyId,
    order.id,
    `Pembayaran diterima via ${(options.method || "QRIS").toUpperCase()}`
  );

  // Update log pembayaran terakhir milik NotivGo (jika ada).
  try {
    const logRows = (await prisma.$queryRawUnsafe(
      `SELECT "id" FROM payment_logs
       WHERE "orderId" = $1 AND "provider" = 'NOTIVGO'
       ORDER BY "createdAt" DESC LIMIT 1`,
      order.id
    )) as any[];

    if (logRows.length > 0) {
      await prisma.$executeRawUnsafe(
        `UPDATE payment_logs
         SET "status" = 'COMPLETED', "rawResponse" = $1
         WHERE "id" = $2`,
        JSON.stringify({
          confirmedAt: new Date().toISOString(),
          amount: options.amount ?? Number(order.total),
        }),
        logRows[0].id
      );
    }
  } catch (error: any) {
    console.error(
      "[Payment] Gagal update payment_logs:",
      error?.message || error
    );
  }

  // Notifikasi WhatsApp ke admin (fire-and-forget, tidak menghambat respons).
  try {
    let address: any = {};
    try {
      address = JSON.parse(order.addressSnapshot || "{}");
    } catch {}

    const { notifyPaymentReceived } = await import("@/lib/fonnte");
    notifyPaymentReceived({
      orderNumber,
      customerName: address.name || "Customer",
      total: Number(order.total),
      paymentMethod: options.method || "qris",
      amountPaid: options.amount,
    }).catch((error: any) =>
      console.error("[Fonnte] Notifikasi pembayaran gagal:", error?.message || error)
    );
  } catch (error: any) {
    console.error("[Fonnte] Gagal memuat modul:", error?.message || error);
  }

  return true;
}
