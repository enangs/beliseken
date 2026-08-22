# 🚀 Setup Supabase Database untuk BeliSeken.com

## Langkah 1: Buat Akun Supabase

1. Buka **https://supabase.com**
2. Klik **"Start your project"**
3. Sign up dengan GitHub (paling mudah)
4. Verifikasi email jika diminta

## Langkah 2: Buat Project Baru

1. Dashboard Supabase → Klik **"New Project"**
2. Isi form:
   - **Organization**: Pilih atau buat baru
   - **Project name**: `beliseken`
   - **Database Password**: Buat password kuat (simpan!)
   - **Region**: `Southeast Asia (Singapore)` - paling dekat
3. Klik **"Create new project"**
4. Tunggu 1-2 menit sampai selesai

## Langkah 3: Copy Database URL

1. Buka project yang baru dibuat
2. Klik **"Settings"** (gear icon) → **"Database"**
3. Scroll ke **"Connection string"**
4. Pilih tab **"URI"**
5. Copy URL lengkap, contoh:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
   ```
6. **PENTING**: Ganti `[YOUR-PASSWORD]` dengan password yang tadi dibuat

## Langkah 4: Setup di GitHub

1. Buka repo **https://github.com/enangs/beliseken/settings/secrets/actions**
2. Klik **"New repository secret"**
3. Tambah secret baru:
   - **Name**: `DATABASE_URL`
   - **Value**: URL yang tadi di-copy (dari Supabase)
4. Klik **"Add secret"**

## Langkah 5: Update Prisma Schema

Buka file `prisma/schema.prisma` dan pastikan sudah PostgreSQL:

```prisma
datasource db {
  provider = "postgresql"  ← Pastikan ini
  url      = env("DATABASE_URL")
}
```

## Langkah 6: Generate Migration

Jalankan di terminal lokal:

```bash
cd beliseken

# Generate Prisma client
npx prisma generate

# Create migration untuk PostgreSQL
npx prisma migrate dev --name init-postgres

# Seed database
npm run db:seed

# Migrate 50 products
npx tsx prisma/migrate-products.ts
```

## Langkah 7: Push ke GitHub

```bash
git add -A
git commit -m "feat: migrate to PostgreSQL via Supabase"
git push origin main
```

GitHub Actions otomatis build & deploy!

## Langkah 8: Test Website

1. Buka **https://beliseken.com**
2. Test semua halaman:
   - Homepage ( produk dari database)
   - Products (50 produk)
   - Product detail
   - Admin login
3. Login admin: `admin@beliseken.com` / `123456`

---

## Troubleshooting

### Error: "Connection refused"
- Pastikan IP Supabase di-whitelist (Settings → Database → Network)
- Tambahkan `0.0.0.0/0` untuk allow all

### Error: "Password authentication failed"
- Cek password di DATABASE_URL
- Reset password di Supabase Dashboard → Settings → Database

### Error: "Database does not exist"
- Pastikan menggunakan database `postgres` (default)

### Products tidak muncul
- Jalankan `npx tsx prisma/migrate-products.ts` lagi
- Cek log di Supabase Dashboard → Logs

---

## Links Penting

- **Supabase Dashboard**: https://supabase.com/dashboard
- **Database Settings**: https://supabase.com/dashboard/project/_/settings/database
- **SQL Editor**: https://supabase.com/dashboard/project/_/sql
- **Table Editor**: https://supabase.com/dashboard/project/_/editor

---

## Verifikasi Database

Setelah setup, cek di Supabase Table Editor:
- `categories` → 5 rows
- `subcategories` → 14 rows
- `brands` → 15 rows
- `condition_grades` → 6 rows
- `products` → 50 rows
- `product_units` → 150 rows
- `users` → 1 row (admin)
- `banners` → 2 rows
