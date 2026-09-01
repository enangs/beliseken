// Simple middleware - only protect admin API routes (except auth)
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip auth for login/logout and cleanup endpoints
  if (pathname.includes('/api/admin/auth/') || pathname.includes('/api/admin/orders/cleanup')) {
    return NextResponse.next();
  }

  // Protect other admin API routes
  if (pathname.startsWith('/api/admin/')) {
    const token = request.cookies.get('beliseken_admin_token')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Silakan login sebagai admin' },
        { status: 401 }
      );
    }

    // Simple token check - just verify it exists (JWT verify done in API routes)
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/admin/:path*'],
};
