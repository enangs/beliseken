import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const token = process.env.FONNTE_TOKEN;
  const admin = process.env.ADMIN_WHATSAPP;
  
  return NextResponse.json({
    hasToken: !!token,
    tokenLength: token?.length || 0,
    tokenPreview: token ? `${token.substring(0, 4)}...` : "NOT SET",
    adminPhone: admin || "NOT SET",
  });
}
