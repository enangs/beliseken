// Admin Logout API - Clear JWT cookie
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { clearAdminCookie } from '@/lib/admin-auth-middleware';

export async function POST(request: NextRequest) {
  const response = NextResponse.json({
    success: true,
    message: 'Logout successful',
  });

  return clearAdminCookie(response);
}
