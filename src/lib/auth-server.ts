// ══════════════════════════════════════════════════════════════
// Server-only Auth (NextAuth + Prisma)
// Supports: Email/Password, Phone/Password, Google, Facebook
// ══════════════════════════════════════════════════════════════

import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import bcrypt from 'bcryptjs';
import { prisma } from './prisma';

// Build providers array conditionally
const providers: any[] = [];

// ─── Google OAuth (only if env vars are set) ──────────────
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  );
}

// ─── Email/Password + Phone/Password ─────────────────────
providers.push(
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
          const users = await prisma.$queryRaw`
            SELECT id, email, password, name, phone, city, "role", "isActive", "avatarUrl"
            FROM users WHERE phone = ${variant} LIMIT 1
          ` as any[];
          if (users && users.length > 0) {
            user = users[0];
            break;
          }
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
      });

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        image: user.avatarUrl,
      };
    },
  })
);

export const authOptions = {
  providers,

  session: {
    strategy: 'jwt' as const,
  },

  callbacks: {
    // ─── Handle OAuth sign-in ──────────────────────────────
    async signIn({ user, account }: any) {
      // Only handle social logins
      if (account?.provider !== 'google' && account?.provider !== 'facebook') {
        return true;
      }

      const email = user.email;
      if (!email) return false;

      try {
        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
          where: { email },
        });

        if (existingUser) {
          // Update last login
          await prisma.user.update({
            where: { id: existingUser.id },
            data: { lastLoginAt: new Date() },
          });
          user.id = existingUser.id;
          user.role = existingUser.role;
        } else {
          // Create new user via raw SQL (safe even if columns don't exist)
          const userId = `${account.provider}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
          const now = new Date().toISOString();

          try {
            await prisma.$executeRaw`
              INSERT INTO users (id, email, password, name, phone, city, "role", "isActive", "emailVerified", "avatarUrl", "createdAt", "updatedAt")
              VALUES (${userId}, ${email}, null, ${user.name || email.split('@')[0]}, null, null, 'CUSTOMER', true, true, ${user.image || null}, ${now}::timestamp, ${now}::timestamp)
            `;
          } catch (insertErr: any) {
            console.error('Failed to create social user:', insertErr.message);
            // If insert fails (e.g. missing columns), try simpler insert
            await prisma.$executeRaw`
              INSERT INTO users (id, email, password, name, "role", "isActive", "createdAt", "updatedAt")
              VALUES (${userId}, ${email}, null, ${user.name || email.split('@')[0]}, 'CUSTOMER', true, ${now}::timestamp, ${now}::timestamp)
            `;
          }

          user.id = userId;
          user.role = 'CUSTOMER';
        }
      } catch (err: any) {
        console.error('SignIn callback error:', err.message);
        // Don't block login even if callback fails
      }

      return true;
    },

    async jwt({ token, user }: any) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
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

  secret: process.env.NEXTAUTH_SECRET,
};

export const { handlers, signIn, signOut } = NextAuth(authOptions);
