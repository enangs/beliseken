export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server';
export async function GET() {
  return NextResponse.json({
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? 'SET (len:' + process.env.GOOGLE_CLIENT_ID.length + ')' : 'MISSING',
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? 'SET (len:' + process.env.GOOGLE_CLIENT_SECRET.length + ')' : 'MISSING',
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'SET (len:' + process.env.NEXTAUTH_SECRET.length + ')' : 'MISSING',
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'MISSING',
  });
}
