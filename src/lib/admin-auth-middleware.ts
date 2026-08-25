// Server-side Admin Authentication Middleware
// Uses JWT tokens stored in HTTP-only cookies
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'beliseken-admin-secret-key-2026-production';
const ADMIN_COOKIE = 'beliseken_admin_token';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

// Verify admin token from request
export function verifyAdminAuth(request: NextRequest): AdminUser | null {
  try {
    const token = request.cookies.get(ADMIN_COOKIE)?.value;
    if (!token) return null;

    const decoded = jwt.verify(token, JWT_SECRET) as AdminUser;
    if (!decoded || decoded.role !== 'SUPER_ADMIN') return null;

    return decoded;
  } catch {
    return null;
  }
}

// Create admin JWT token
export function createAdminToken(user: AdminUser): string {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
}

// Set admin cookie in response
export function setAdminCookie(response: NextResponse, token: string): NextResponse {
  response.cookies.set(ADMIN_COOKIE, token, {
    httpOnly: true,      // Cannot be accessed by JavaScript
    secure: true,        // Only sent over HTTPS
    sameSite: 'strict',  // CSRF protection
    maxAge: 86400,       // 24 hours
    path: '/',
  });
  return response;
}

// Clear admin cookie
export function clearAdminCookie(response: NextResponse): NextResponse {
  response.cookies.delete(ADMIN_COOKIE);
  return response;
}

// Middleware helper: return 401 if not admin
export function requireAdmin(request: NextRequest): NextResponse | AdminUser {
  const admin = verifyAdminAuth(request);
  if (!admin) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized. Admin access required.' },
      { status: 401 }
    );
  }
  return admin;
}
