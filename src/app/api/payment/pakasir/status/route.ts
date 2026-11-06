export const dynamic = "force-dynamic";

import { NextRequest } from "next/server";
import { GET as getNotivGoStatus } from "../../notivgo/status/route";

/**
 * Alias lama untuk kompatibilitas.
 *
 * APK yang sudah terpasang (≤ 1.5.6) masih memanggil path ini.
 * Status pembayaran sekarang dibaca dari NotivGo.
 */
export async function GET(request: NextRequest) {
  return getNotivGoStatus(request);
}
