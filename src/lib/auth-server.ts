// ══════════════════════════════════════════════════════════════
// Server-only Auth (NextAuth v5 + Prisma)
// Supports: Email/Password, Phone/Password, Google
// ══════════════════════════════════════════════════════════════

import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import bcrypt from 'bcryptjs';
import { prisma } from './prisma';

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
console.log('Auth init - GOOGLE_CLIENT_ID:', googleClientId ? 'present (' + googleClientId.length + ' chars)' : 'MISSING');
console.log('Auth init - GOOGLE_CLIENT_SECRET:', googleClientSecret ? 'present (' + googleClientSecret.length + ' chars)' : 'MISSING');
console.log('Auth init - NEXTAUTH_SECRET:', process.env.NEXTAUTH_SECRET ? 'present' : 'MISSING');

export const { handlers, signIn, signOut } = NextAuth({
  providers: [
    // ─── Google OAuth ───────────────────────────────────────
    ...(googleClientId && googleClientSecret
      ? [GoogleProvider({
          clientId: googleClientId,
          clientSecret: googleClientSecret,
        })]
      : []),

    // ─── Email/Password + Phone/Password ─────────────────────
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email atau No HP', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials: any) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email/No HP dan password harus diisi');
        }

        // Try email first, then phone
        let user: any = null;

        // Try by email
        user = await prisma.user.findUnique({
          where: { email: credentials.email.toLowerCase() },
        });

        // Try by phone if not found
        if (!user) {
          const phone = credentials.email.replace(/\D/g, '');
          const phoneVariants = [
            phone,
            `+62${phone.startsWith('0') ? phone.slice(1) : phone}`,
            `62${phone.startsWith('0') ? phone.slice(1) : phone}`,
          ];

          for (const variant of phoneVariants) {
            const users = await prisma.$queryRaw`
              SELECT id, email, password, name, phone, city, "role", "isActive", "avatarUrl"
              FROM users WHERE phone = ${variant} LIMIT 1
            ` as any[];
            if (users && users.length > 0) {
              user = users[0];
              break;
            }
          }
        }

        if (!user || !user.isActive) {
          throw new Error('Akun tidak ditemukan atau tidak aktif');
        }

        if (!user.password) {
          throw new Error('Akun ini menggunakan login sosial. Silakan login dengan Google.');
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
        if (!isPasswordValid) {
          throw new Error('Password salah');
        }

        await prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        }).catch(() => {});

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

  session: { strategy: 'jwt' },

  callbacks: {
    async signIn({ user, account }: any) {
      if (account?.provider !== 'google') return true;

      const email = user.email;
      if (!email) return false;

      try {
        const existingUser = await prisma.user.findUnique({ where: { email } });

        if (existingUser) {
          await prisma.user.update({
            where: { id: existingUser.id },
            data: { lastLoginAt: new Date() },
          }).catch(() => {});
          user.id = existingUser.id;
          (user as any).role = existingUser.role;
        } else {
          const userId = `google-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
          const now = new Date().toISOString();

          await prisma.$executeRaw`
            INSERT INTO users (id, email, password, name, "role", "isActive", "emailVerified", "avatarUrl", "createdAt", "updatedAt")
            VALUES (${userId}, ${email}, null, ${user.name || email.split('@')[0]}, 'CUSTOMER', true, true, ${user.image || null}, ${now}::timestamp, ${now}::timestamp)
          `;
          user.id = userId;
          (user as any).role = 'CUSTOMER';
        }
      } catch (err: any) {
        console.error('Google sign-in callback error:', err.message);
      }

      return true;
    },

    async jwt({ token, user }: any) {
      if (user) {
        token.role = (user as any).role;
        token.id = user.id;
      }
      return token;
    },

    async session({ session, token }: any) {
      if (session.user) {
        session.user.role = token.role;
        (session.user as any).id = token.id;
      }
      return session;
    },

    async redirect({ url, baseUrl }: any) {
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      try {
        if (new URL(url).origin === baseUrl) return url;
      } catch {}
      return `${baseUrl}/dashboard`;
    },
  },

  pages: {
    signIn: '/login',
    error: '/login',
  },
});
