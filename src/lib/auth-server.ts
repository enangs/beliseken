// ══════════════════════════════════════════════════════════════
// Server-only Auth (NextAuth v5 + Prisma)
// Supports: Email/Password, Phone/Password, Google
// ══════════════════════════════════════════════════════════════

import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { prisma } from './prisma';

export const { handlers, signIn, signOut } = NextAuth({
  trustHost: true,

  providers: [
    // ─── Email/Password + Phone/Password (auto-detect) ──────
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

        let user: any = null;

        // Try by email first
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
  },

  pages: {
    signIn: '/login',
    error: '/login',
  },
});
