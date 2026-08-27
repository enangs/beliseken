export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const baseUrl = process.env.NEXTAUTH_URL || 'https://beliseken.com';

  if (error || !code) {
    return NextResponse.redirect(`${baseUrl}/login?error=Google+login+failed`);
  }

  try {
    // Exchange code for tokens
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: `${baseUrl}/api/auth/google/callback`,
        grant_type: 'authorization_code',
      }),
    });

    const tokenData = await tokenRes.json();

    if (!tokenData.access_token) {
      console.error('Google token exchange failed:', tokenData);
      return NextResponse.redirect(`${baseUrl}/login?error=Google+token+failed`);
    }

    // Get user info from Google
    const userRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    const googleUser = await userRes.json();

    if (!googleUser.email) {
      return NextResponse.redirect(`${baseUrl}/login?error=Google+no+email`);
    }

    const email = googleUser.email.toLowerCase();
    const name = googleUser.name || email.split('@')[0];
    const image = googleUser.picture || null;

    // Find or create user in database
    let user = await prisma.user.findUnique({ where: { email } });

    if (user) {
      // Update existing user
      await prisma.user.update({
        where: { id: user.id },
        data: {
          lastLoginAt: new Date(),
          avatarUrl: image || user.avatarUrl,
        },
      });
    } else {
      // Create new user
      const userId = `google-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const now = new Date().toISOString();

      try {
        await prisma.$executeRaw`
          INSERT INTO users (id, email, password, name, "role", "isActive", "emailVerified", "avatarUrl", "createdAt", "updatedAt")
          VALUES (${userId}, ${email}, null, ${name}, 'CUSTOMER', true, true, ${image}, ${now}::timestamp, ${now}::timestamp)
        `;
      } catch (insertErr: any) {
        console.error('Failed to create Google user:', insertErr.message);
        return NextResponse.redirect(`${baseUrl}/login?error=Failed+to+create+account`);
      }

      user = await prisma.user.findUnique({ where: { id: userId } });
    }

    if (!user) {
      return NextResponse.redirect(`${baseUrl}/login?error=User+not+found`);
    }

    // Create session cookie (simple JWT-like token)
    const sessionData = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      city: user.city,
      role: user.role,
      avatarUrl: user.avatarUrl,
      createdAt: user.createdAt,
      addresses: [],
    };

    const response = NextResponse.redirect(`${baseUrl}/dashboard`);

    // Set session in cookie (same format as login API)
    response.cookies.set('beliseken_user_session', JSON.stringify(sessionData), {
      path: '/',
      httpOnly: false, // Client-side reads it
      secure: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    // Also set in localStorage via a script
    const html = `<!DOCTYPE html>
<html>
<head><title>Login Berhasil</title></head>
<body>
  <script>
    localStorage.setItem('beliseken_user_session', '${JSON.stringify(sessionData).replace(/'/g, "\\'")}');
    window.location.href = '${baseUrl}/dashboard';
  </script>
</body>
</html>`;

    return new NextResponse(html, {
      status: 200,
      headers: { 'Content-Type': 'text/html' },
    });

  } catch (err: any) {
    console.error('Google callback error:', err.message);
    return NextResponse.redirect(`${baseUrl}/login?error=Google+login+failed`);
  }
}
