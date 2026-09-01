// ══════════════════════════════════════════════════════════════
// Pakasir Payment Gateway Client
// Docs: https://pakasir.com/p/docs
// ══════════════════════════════════════════════════════════════

const PAKASIR_API_BASE = "https://app.pakasir.com/api";

export interface PakasirConfig {
  slug: string;
  apiKey: string;
}

export interface PakasirTransactionRequest {
  orderId: string;
  amount: number;
  method?: string; // qris, bri_va, bni_va, etc.
}

export interface PakasirTransactionResponse {
  payment: {
    project: string;
    order_id: string;
    amount: number;
    fee: number;
    total_payment: number;
    payment_method: string;
    payment_number: string; // QR string or VA number
    expired_at: string;
  };
}

export interface PakasirWebhookPayload {
  amount: number;
  order_id: string;
  project: string;
  status: string;
  payment_method: string;
  completed_at: string;
}

export interface PakasirTransactionDetail {
  transaction: {
    amount: number;
    order_id: string;
    project: string;
    status: string;
    payment_method: string;
    completed_at: string;
  };
}

function getConfig(): PakasirConfig {
  const slug = process.env.PAKASIR_SLUG;
  const apiKey = process.env.PAKASIR_API_KEY;
  if (!slug || !apiKey) {
    throw new Error("PAKASIR_SLUG and PAKASIR_API_KEY must be set in environment");
  }
  return { slug, apiKey };
}

/**
 * Create a new payment transaction via PakaSir API
 */
export async function createPakasirTransaction(
  req: PakasirTransactionRequest
): Promise<PakasirTransactionResponse> {
  const config = getConfig();
  const method = req.method || "qris";

  const res = await fetch(`${PAKASIR_API_BASE}/transactioncreate/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      project: config.slug,
      order_id: req.orderId,
      amount: req.amount,
      api_key: config.apiKey,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`PakaSir API error (${res.status}): ${text}`);
  }

  return res.json();
}

/**
 * Check transaction status via PakaSir API
 */
export async function getPakasirTransactionDetail(
  orderId: string,
  amount: number
): Promise<PakasirTransactionDetail> {
  const config = getConfig();

  const url = new URL(`${PAKASIR_API_BASE}/transactiondetail`);
  url.searchParams.set("project", config.slug);
  url.searchParams.set("order_id", orderId);
  url.searchParams.set("amount", String(amount));
  url.searchParams.set("api_key", config.apiKey);

  const res = await fetch(url.toString());

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`PakaSir API error (${res.status}): ${text}`);
  }

  return res.json();
}

/**
 * Cancel a transaction via PakaSir API
 */
export async function cancelPakasirTransaction(
  orderId: string,
  amount: number
): Promise<void> {
  const config = getConfig();

  const res = await fetch(`${PAKASIR_API_BASE}/transactioncancel`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      project: config.slug,
      order_id: orderId,
      amount: amount,
      api_key: config.apiKey,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`PakaSir cancel error (${res.status}): ${text}`);
  }
}

/**
 * Generate payment URL for redirect-based integration
 */
export function getPakasirPaymentUrl(
  orderId: string,
  amount: number,
  options?: { redirect?: string; qrisOnly?: boolean }
): string {
  const config = getConfig();
  const url = new URL(
    `https://app.pakasir.com/pay/${config.slug}/${amount}`
  );
  url.searchParams.set("order_id", orderId);
  if (options?.redirect) {
    url.searchParams.set("redirect", options.redirect);
  }
  if (options?.qrisOnly) {
    url.searchParams.set("qris_only", "1");
  }
  return url.toString();
}
