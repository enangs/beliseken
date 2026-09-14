export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const baseUrl = process.env.NEXTAUTH_URL || 'https://beliseken.com';

  if (!clientId) {
    return NextResponse.redirect(`${baseUrl}/login?error=Google+not+configured`);
  }

  const { searchParams: requestParams } = new URL(request.url);
  const redirectTo = requestParams.get('redirect') || '/products';

  const redirectUri = `${baseUrl}/api/auth/google/callback`;
  const scope = 'openid email profile';

  // Simpan halaman tujuan setelah login di state (default /products)
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope,
    access_type: 'offline',
    prompt: 'consent',
    state: Buffer.from(redirectTo).toString('base64url'),
  });

  return NextResponse.redirect(
    `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
  );
}
