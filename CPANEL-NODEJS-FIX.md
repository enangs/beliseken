# Fix: "Directory '/public_html' not in user home"

## Solusi

Saat buat Node.js App di cPanel, isi **Application root** dengan salah satu:

### Opsi 1: Path relatif dari home (Recommended)
```
public_html
```
(Tanpa `/` di depan)

### Opsi 2: Path absolut home
```
/home/beliseken/public_html
```

### Opsi 3: Biarkan kosong
Jika ada opsi "Default", pilih itu.

---

## Setelah Itu

1. Klik **Create**
2. Buka **Terminal** di cPanel
3. Jalankan:
```bash
cd ~/public_html
npm install
npx prisma generate
npx prisma migrate deploy
npx prisma db seed
npx tsx prisma/migrate-products.ts
```
4. Klik **Start** di Node.js App menu

---

## Jika Masih Error

Coba dengan path:
```
~/public_html
```
Atau:
```
./public_html
```
