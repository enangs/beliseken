// ══════════════════════════════════════════════════════════════
// Fonnte WhatsApp Notification Service
// Docs: https://docs.fonnte.com/api-send-message/
// ══════════════════════════════════════════════════════════════

const FONNTE_API_URL = "https://api.fonnte.com/send";

function getToken(): string | null {
  return process.env.FONNTE_TOKEN || null;
}

function getAdminPhone(): string {
  return process.env.ADMIN_WHATSAPP || "085101256123";
}

export interface SendOptions {
  target: string;
  message: string;
}

/**
 * Send WhatsApp message via Fonnte API
 */
export async function sendWhatsApp(options: SendOptions): Promise<boolean> {
  const token = getToken();
  if (!token) {
    console.warn("[Fonnte] FONNTE_TOKEN not configured");
    return false;
  }

  try {
    const formData = new URLSearchParams();
    formData.append("target", options.target);
    formData.append("message", options.message);
    formData.append("countryCode", "62");
    formData.append("typing", "false");
    formData.append("delay", "2");

    const res = await fetch(FONNTE_API_URL, {
      method: "POST",
      headers: {
        Authorization: token,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
    });

    const data = await res.json();
    if (data.status === false) {
      console.error("[Fonnte] Send failed:", data.message || data.reason);
      return false;
    }

    console.log(`[Fonnte] Message sent to ${options.target}`);
    return true;
  } catch (error: any) {
    console.error("[Fonnte] Error:", error.message);
    return false;
  }
}

// ══════════════════════════════════════════════════════════════
// NOTIFICATION TEMPLATES
// ══════════════════════════════════════════════════════════════

function formatPrice(amount: number): string {
  return `Rp${amount.toLocaleString("id-ID")}`;
}

/**
 * Notify admin about new order
 */
export async function notifyNewOrder(order: {
  orderNumber: string;
  customerName: string;
  total: number;
  paymentMethod: string;
  items?: string;
}) {
  const methodLabel =
    order.paymentMethod === "qris"
      ? "QRIS"
      : order.paymentMethod?.startsWith("va_")
      ? `VA ${order.paymentMethod.replace("va_", "").toUpperCase()}`
      : order.paymentMethod === "cod"
      ? "COD"
      : "Transfer Bank";

  const message = `🛒 *PESANAN BARU*

📋 No. Pesanan: *${order.orderNumber}*
👤 Customer: ${order.customerName}
💰 Total: *${formatPrice(order.total)}*
💳 Metode: ${methodLabel}
${order.items ? `📦 Item: ${order.items}` : ""}

_Segera verifikasi dan proses pesanan._

🔗 Admin: https://beliseken.com/admin/orders`;

  return sendWhatsApp({
    target: getAdminPhone(),
    message,
  });
}

/**
 * Notify admin about payment received
 */
export async function notifyPaymentReceived(order: {
  orderNumber: string;
  customerName: string;
  total: number;
  paymentMethod: string;
  amountPaid?: number;
}) {
  const methodLabel =
    order.paymentMethod === "qris"
      ? "QRIS"
      : order.paymentMethod?.startsWith("va_")
      ? `VA ${order.paymentMethod.replace("va_", "").toUpperCase()}`
      : order.paymentMethod;

  const message = `✅ *PEMBAYARAN DITERIMA*

📋 No. Pesanan: *${order.orderNumber}*
👤 Customer: ${order.customerName}
💰 Dibayar: *${formatPrice(order.amountPaid || order.total)}*
💳 Metode: ${methodLabel}
💵 Total Order: ${formatPrice(order.total)}

_Status order otomatis terupdate ke PAID._

🔗 Admin: https://beliseken.com/admin/orders`;

  return sendWhatsApp({
    target: getAdminPhone(),
    message,
  });
}

/**
 * Notify admin about order shipped
 */
export async function notifyOrderShipped(order: {
  orderNumber: string;
  customerName: string;
  trackingNumber: string;
  courier: string;
}) {
  const message = `🚚 *PESANAN DIKIRIM*

📋 No. Pesanan: *${order.orderNumber}*
👤 Customer: ${order.customerName}
📮 Kurir: ${order.courier}
🔢 No. Resi: *${order.trackingNumber}*

_Customer sudah diberitahu via email/dashboard._

🔗 Admin: https://beliseken.com/admin/orders`;

  return sendWhatsApp({
    target: getAdminPhone(),
    message,
  });
}

/**
 * Notify admin about order cancelled
 */
export async function notifyOrderCancelled(order: {
  orderNumber: string;
  customerName: string;
  total: number;
}) {
  const message = `❌ *PESANAN DIBATALKAN*

📋 No. Pesanan: *${order.orderNumber}*
👤 Customer: ${order.customerName}
💰 Total: ${formatPrice(order.total)}

_Link: https://beliseken.com/admin/orders`;

  return sendWhatsApp({
    target: getAdminPhone(),
    message,
  });
}
