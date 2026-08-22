# BeliSeken.com — Deployment Guide

## Opsi Deploy ke cPanel

### Opsi 1: cPanel dengan Node.js Support (Recommended)

Jika cPanel Anda mendukung Node.js (biasanya ada menu "Setup Node.js App" atau "Node.js Selector"):

1. **Login cPanel** → Cari menu **"Setup Node.js"** atau **"Node.js App"**

2. **Create Application:**
   - Node.js version: 20.x
   - Application mode: Production
   - Application root: `/public_html`
   - Application URL: `beliseken.com`
   - Application startup file: `server.js`

3. **Upload Files via FTP:**
   - Upload semua file dari folder `deploy/` (yang di-generate oleh GitHub Actions)
   - Atau upload manual:
     ```
     .next/
     node_modules/
     prisma/
     package.json
     next.config.mjs
     .env
     ```

4. **Setup Database:**
   - Login ke cPanel → **File Manager**
   - Pastikan file `prisma/prod.db` ada di `/public_html/prisma/`
   - Atau gunakan MySQL/PostgreSQL dari cPanel

5. **Install Dependencies:**
   - Buka **Terminal** di cPanel (jika tersedia)
   - Jalankan:
     ```bash
     cd /public_html
     npm install
     npx prisma migrate deploy
     ```

6. **Start Application:**
   - Di menu Node.js App, klik **"Start"**
   - Atau restart dari menu

---

### Opsi 2: Static Export + API (Jika Tidak Ada Node.js)

Jika cPanel TIDAK mendukung Node.js, kita perlu split:

1. **Frontend (Static Export):**
   - Gunakan workflow lama dengan `output: "export"`
   - Deploy folder `out/` ke `/public_html/`

2. **Backend API (Separate Server):**
   - Deploy API ke VPS/Railway/Fly.io
   - Update `NEXT_PUBLIC_API_URL` di frontend

3. **Database:**
   - Gunakan hosted database (Supabase/Neon/PlanetScale)
   - Update `DATABASE_URL` di backend

---

### Opsi 3: Vercel (Paling Mudah)

Deploy ke Vercel (gratis untuk hobby):

1. Push ke GitHub
2. Login ke [vercel.com](https://vercel.com)
3. Import repository `enangs/beliseken`
4. Set environment variables:
   - `DATABASE_URL`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL`
5. Deploy otomatis!

**Database:** Gunakan Vercel Postgres atau Supabase (gratis)

---

## Environment Variables

### Development (.env.local)
```
DATABASE_URL="file:./prisma/dev.db"
NEXTAUTH_SECRET="dev-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

### Production (.env)
```
DATABASE_URL="file:./prisma/prod.db"
NEXTAUTH_SECRET="your-production-secret"
NEXTAUTH_URL="https://beliseken.com"
```

### Database URL Options
```
# SQLite (file-based)
DATABASE_URL="file:./prisma/prod.db"

# PostgreSQL (Supabase)
DATABASE_URL="postgresql://user:pass@host:5432/beliseken"

# PostgreSQL (Neon)
DATABASE_URL="postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/beliseken"

# MySQL
DATABASE_URL="mysql://user:pass@host:3306/beliseken"
```

---

## Database Migration

### Local Development
```bash
npx prisma migrate dev
npx prisma db seed
npx tsx prisma/migrate-products.ts
```

### Production
```bash
npx prisma migrate deploy
npx prisma db seed
npx tsx prisma/migrate-products.ts
```

### Switch to PostgreSQL
1. Update `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
2. Update `.env` with PostgreSQL URL
3. Run migration:
   ```bash
   npx prisma migrate dev --name init
   ```
4. Re-seed data:
   ```bash
   npm run db:seed
   npx tsx prisma/migrate-products.ts
   ```

---

## GitHub Secrets Setup

Buka repo → Settings → Secrets → Actions, tambah:

| Secret | Value |
|--------|-------|
| `DATABASE_URL` | `postgresql://...` atau `file:./prisma/prod.db` |
| `NEXTAUTH_SECRET` | Random string (generate: `openssl rand -base64 32`) |
| `NEXTAUTH_URL` | `https://beliseken.com` |
| `CPANEL_FTP_HOST` | FTP host cPanel |
| `CPANEL_FTP_USERNAME` | FTP username |
| `CPANEL_FTP_PASSWORD` | FTP password |

---

## Troubleshooting

### Error: "Database not found"
- Pastikan `DATABASE_URL` benar
- Jalankan `npx prisma migrate deploy`

### Error: "Module not found"
- Jalankan `npm install` di server

### Error: "NEXTAUTH_SECRET undefined"
- Pastikan environment variable ter-set

### Website hanya menampilkan index listing
- Pastikan Node.js app berjalan di cPanel
- Atau gunakan PHP fallback (lihat `.htaccess`)
