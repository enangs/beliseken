// Next.js Middleware - Protects all /api/admin/* routes
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'beliseken-admin-secret-key-2026-production';
const ADMIN_COOKIE = 'beliseken_admin_token';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /api/admin/* routes (except login)
  if (pathname.startsWith('/api/admin/') && !pathname.includes('/api/admin/auth/')) {
    const token = request.cookies.get(ADMIN_COOKIE)?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Silakan login sebagai admin.' },
        { status: 401 }
      );
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      if (!decoded || (decoded.role !== 'SUPER_ADMIN' && decoded.role !== 'ADMIN')) {
        return NextResponse.json(
          { success: false, error: 'Akses ditolak. Hanya admin yang diizinkan.' },
          { status: 403 }
        );
      }
      // Token valid, continue
      return NextResponse.next();
    } catch {
      return NextResponse.json(
        { success: false, error: 'Sesi admin berakhir. Silakan login kembali.' },
        { status: 401 }
      );
    }
  }

  // Protect admin pages (not API)
  if (pathname.startsWith('/admin') && !pathname.includes('/admin/login')) {
    const token = request.cookies.get(ADMIN_COOKIE)?.value;
    
    if (!token) {
      // Redirect to login
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      if (!decoded || (decoded.role !== 'SUPER_ADMIN' && decoded.role !== 'ADMIN')) {
        return NextResponse.redirect(new URL('/admin/login', request.url));
      }
      return NextResponse.next();
    } catch {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/api/admin/:path*',
    '/admin/:path*',
  ],
};
