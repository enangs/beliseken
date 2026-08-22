# 🚀 Deploy BeliSeken.com ke cPanel dengan MySQL

## Opsi 1: cPanel dengan Node.js + MySQL (Recommended)

Jika cPanel Anda ada menu **"Setup Node.js"** atau **"Node.js Selector"**:

### Step 1: Buat MySQL Database di cPanel

1. Login **cPanel** → cari menu **"MySQL® Databases"**
2. Buat database baru:
   - Database Name: `beliseken_db`
   - Klik **"Create Database"**
3. Buat user database:
   - Username: `beliseken_user`
   - Password: buat kuat (simpan!)
   - Klik **"Create User"**
4. Tambah user ke database:
   - Pilih database `beliseken_db`
   - Pilih user `beliseken_user`
   - Centang **"ALL PRIVILEGES"**
   - Klik **"Make Changes"**

### Step 2: Setup Node.js App

1. Login **cPanel** → cari menu **"Setup Node.js"** atau **"Node.js App"**
2. Klik **"Create Application"**
   - **Node.js version**: 20.x (atau yang tersedia)
   - **Application mode**: Production
   - **Application root**: `/public_html`
   - **Application URL**: `beliseken.com`
   - **Application startup file**: `server.js`
3. Klik **"Create"**

### Step 3: Upload Files via FTP

Upload semua file ke `/public_html/`:
```
.next/
node_modules/
prisma/
public/
src/
package.json
next.config.mjs
.env
server.js
```

### Step 4: Buat File .env

Buat file `.env` di `/public_html/`:
```env
DATABASE_URL="mysql://beliseken_user:PASSWORD_ANDA@localhost:3306/beliseken_db"
NEXTAUTH_SECRET="beliseken-production-2026"
NEXTAUTH_URL="https://beliseken.com"
NODE_ENV="production"
```

Ganti `PASSWORD_ANDA` dengan password MySQL yang tadi dibuat.

### Step 5: Buat File server.js

Buat file `server.js` di `/public_html/`:
```javascript
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const dev = false;
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(3000, () => {
    console.log('> Ready on http://localhost:3000');
  });
});
```

### Step 6: Install Dependencies & Setup Database

Buka **Terminal** di cPanel (atau SSH):
```bash
cd /public_html
npm install
npx prisma generate
npx prisma migrate deploy
npx prisma db seed
npx tsx prisma/migrate-products.ts
```

### Step 7: Start Application

Di menu Node.js App, klik **"Start"** atau **"Restart"**.

### Step 8: Test Website

Buka **https://beliseken.com** 🎉

---

## Opsi 2: MySQL + Static Export (Jika Tidak Ada Node.js)

Jika cPanel TIDAK ada menu Node.js:

### Step 1: Buat MySQL Database
(Sama seperti Step 1 di atas)

### Step 2: Deploy API ke VPS/Server Lain
- Deploy API routes ke VPS (DigitalOcean, Linode, dll)
- Atau pakai Railway/Render (gratis)

### Step 3: Deploy Frontend ke cPanel
- Static export ke folder `out/`
- Upload ke cPanel
- Frontend fetch dari API server

---

## Troubleshooting

### Error: "Module not found: mysql2"
```bash
npm install mysql2
```

### Error: "Connection refused"
- Pastikan MySQL host = `localhost` (bukan IP)
- Cek username & password di .env

### Error: "Access denied for user"
- Pastikan user sudah di-grant ALL PRIVILEGES
- Buat ulang user di cPanel → MySQL Databases

### Website tidak bisa diakses
- Pastikan Node.js app sudah di-start
- Cek log error di Node.js App menu

---

## Database Schema (MySQL)

Prisma akan membuat tabel-tabel berikut:

```
categories          → 5 baris
subcategories       → 14 baris
brands              → 15 baris
condition_grades    → 6 baris
products            → 50 baris
product_units       → 150 baris
product_specs       → ~250 baris
users               → 1 baris (admin)
banners             → 2 baris
```

---

## Links

- **cPanel MySQL**: Login cPanel → MySQL® Databases
- **cPanel Node.js**: Login cPanel → Setup Node.js
- **Prisma Docs**: https://pris.ly/d/mysql
