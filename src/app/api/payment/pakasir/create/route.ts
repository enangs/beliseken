export const dynamic = "force-dynamic";

import { NextRequest } from "next/server";
import { POST as createNotivGoPayment } from "../../notivgo/create/route";

/**
 * Alias lama untuk kompatibilitas.
 *
 * APK yang sudah terpasang (≤ 1.5.6) masih memanggil path ini,
 * padahal Pakasir sudah tidak dipakai. Semua pembayaran sekarang
 * diproses oleh NotivGo, dengan bentuk respons yang sama.
 */
export async function POST(request: NextRequest) {
  return createNotivGoPayment(request);
}
