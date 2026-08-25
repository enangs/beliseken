// Admin Route Wrapper - Add this to every /api/admin/* route
import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminAuth, type AdminUser } from '@/lib/admin-auth-middleware';

type AdminHandler = (
  request: NextRequest,
  admin: AdminUser
) => Promise<NextResponse>;

export function withAdminAuth(handler: AdminHandler) {
  return async (request: NextRequest) => {
    const admin = verifyAdminAuth(request);
    
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Silakan login sebagai admin.' },
        { status: 401 }
      );
    }

    return handler(request, admin);
  };
}
