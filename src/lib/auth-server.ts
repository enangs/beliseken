// ══════════════════════════════════════════════════════════════
// Server-only Auth (NextAuth + Prisma)
// Supports: Email/Password, Phone/Password, Google, Facebook
// ══════════════════════════════════════════════════════════════

import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import FacebookProvider from 'next-auth/providers/facebook';
import bcrypt from 'bcryptjs';
import { prisma } from './prisma';

export const authOptions = {
  providers: [
    // ─── Google OAuth ───────────────────────────────────────
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            authorization: {
              params: {
                prompt: 'consent',
                access_type: 'offline',
                response_type: 'code',
              },
            },
          }),
        ]
      : []),

    // ─── Facebook OAuth ─────────────────────────────────────
    ...(process.env.FACEBOOK_CLIENT_ID && process.env.FACEBOOK_CLIENT_SECRET
      ? [
          FacebookProvider({
            clientId: process.env.FACEBOOK_CLIENT_ID,
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
          }),
        ]
      : []),

    // ─── Email/Password + Phone/Password ─────────────────────
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email atau No HP', type: 'text' },
        password: { label: 'Password', type: 'password' },
        loginType: { label: 'Login Type', type: 'text' },
      },
      async authorize(credentials: any) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email/No HP dan password harus diisi');
        }

        const loginType = credentials.loginType || 'email';
        let user: any = null;

        if (loginType === 'phone') {
          // Find user by phone number
          const phone = credentials.email.replace(/\D/g, '');
          const phoneVariants = [
            phone,
            `+62${phone.startsWith('0') ? phone.slice(1) : phone}`,
            `62${phone.startsWith('0') ? phone.slice(1) : phone}`,
          ];

          for (const variant of phoneVariants) {
            user = await prisma.user.findFirst({
              where: { phone: variant },
            });
            if (user) break;
          }
        } else {
          // Find user by email
          user = await prisma.user.findUnique({
            where: { email: credentials.email.toLowerCase() },
          });
        }

        if (!user || !user.isActive) {
          throw new Error('Akun tidak ditemukan atau tidak aktif');
        }

        // Social login users may not have a password
        if (!user.password) {
          throw new Error('Akun ini menggunakan login sosial. Silakan login dengan Google/Facebook.');
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error('Password salah');
        }

        await prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        });

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          image: user.avatarUrl,
        };
      },
    }),
  ],

  session: {
    strategy: 'jwt' as const,
  },

  callbacks: {
    // ─── Handle OAuth sign-in ──────────────────────────────
    async signIn({ user, account }: any) {
      if (account?.provider === 'google' || account?.provider === 'facebook') {
        const email = user.email;
        const name = user.name;
        const image = user.image;
        const providerId = account.providerAccountId;

        if (!email) return false;

        // Check if user already exists
        let existingUser = await prisma.user.findUnique({
          where: { email },
        });

        if (existingUser) {
          // Update provider info
          await prisma.user.update({
            where: { id: existingUser.id },
            data: {
              provider: account.provider,
              providerId,
              avatarUrl: image || existingUser.avatarUrl,
              lastLoginAt: new Date(),
            },
          });
          user.id = existingUser.id;
          user.role = existingUser.role;
        } else {
          // Create new user
          const userId = `${account.provider}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
          await prisma.user.create({
            data: {
              id: userId,
              email,
              name: name || email.split('@')[0],
              avatarUrl: image,
              provider: account.provider,
              providerId,
              emailVerified: true,
              role: 'CUSTOMER',
              isActive: true,
            },
          });
          user.id = userId;
          user.role = 'CUSTOMER';
        }
      }
      return true;
    },

    async jwt({ token, user, account }: any) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      // On subsequent requests, fetch role from DB if needed
      if (token.id && !token.role) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: token.id as string },
            select: { role: true },
          });
          if (dbUser) token.role = dbUser.role;
        } catch {}
      }
      return token;
    },

    async session({ session, token }: any) {
      if (session.user) {
        session.user.role = token.role;
        session.user.id = token.id;
      }
      return session;
    },

    async redirect({ url, baseUrl }: any) {
      // After social login, redirect to dashboard
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return `${baseUrl}/dashboard`;
    },
  },

  pages: {
    signIn: '/login',
    error: '/login',
  },

  secret: process.env.NEXTAUTH_SECRET,
};

export const { handlers, signIn, signOut } = NextAuth(authOptions);
