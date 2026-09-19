# 📱 API beliseken.com — Dokumentasi untuk Developer Android

**Base URL:** `https://beliseken.com`
**Format:** JSON, semua response diawali `success` (boolean) dan `data` (array/object)
**Auth:** Belum perlu token untuk endpoint publik di bawah.

---

## 1️⃣ DAFTAR PRODUK (paling penting)

```
GET https://beliseken.com/api/products
```

### Query params (opsional, bisa digabung):

| Param | Contoh | Keterangan |
|-------|--------|------------|
| `page` | `?page=1` | Halaman (default 1) |
| `limit` | `?limit=20` | Jumlah per halaman (default 20) |
| `category` | `?category=laptop-notebook` | Slug kategori |
| `brand` | `?brand=lenovo` | Slug brand |
| `condition` | `?condition=A,B` | Grade kondisi (A/B/C, pisah koma) |
| `minPrice` / `maxPrice` | `?minPrice=1000000&maxPrice=5000000` | Range harga (rupiah, angka polos) |
| `q` | `?q=thinkpad` | Pencarian nama/produk |
| `inStock` | `?inStock=true` | Hanya yang ada stok |
| `featured` | `?featured=true` | Produk unggulan |
| `sort` | `?sort=newest` | `newest` / `price_asc` / `price_desc` / `popular` / `rating` |

### Contoh lengkap:

```
https://beliseken.com/api/products?limit=20&inStock=true&sort=newest
https://beliseken.com/api/products?category=laptop-notebook&brand=lenovo&maxPrice=5000000
```

### Response:

```json
{
  "success": true,
  "data": [
    {
      "id": "cmtv7scx70003jp04l983nrv3",
      "name": "Lenovo Thinkpad L13 Gen 2",
      "slug": "lenovo-thinkpad-l13-gen-2",
      "sku": "BS-LP-0100",
      "description": "Catatan: ... (teks panjang, boleh ditampilkan parsial)",
      "shortDesc": null,
      "sellingPrice": 6300000,
      "basePrice": 6500000,
      "discount": 0,
      "weight": 1.3,
      "dimensions": "30 x 20 x 2 cm",
      "badge": null,
      "isFeatured": false,
      "avgRating": 4.6,
      "reviewCount": 45,
      "soldCount": 12,
      "viewCount": 300,
      "createdAt": "2026-09-01T03:14:31.936Z",
      "videoUrl": null,
      "performanceNotes": null,
      "minusNotes": null,
      "category": { "id": "...", "name": "Laptop & Notebook", "slug": "laptop-notebook", "icon": "...", "color": "..." },
      "subcategory": { "id": "...", "name": "Laptop", "slug": "laptop" },
      "brand": { "id": "...", "name": "Lenovo", "slug": "lenovo" },
      "imageBase64": "https://res.cloudinary.com/.../foto-utama.jpg",
      "allImages": [],
      "stock": 3,
      "availableUnits": 3,
      "supplier": "",
      "status": "ACTIVE",
      "condition": "Grade A"
    }
  ],
  "meta": { "page": 1, "limit": 20, "total": 18, "totalPages": 9 }
}
```

⚠️ **Catatan untuk dev:**
- Nama field gambar memang `imageBase64`, tapi isinya sekarang **URL https biasa** (Cloudinary) — langsung dipakai di Coil/Glide.
- `stock == 0` → tampilkan SOLD OUT, `status` juga berubah `"SOLD_OUT"`.
- Harga dalam **rupiah penuh** (integer), format sendiri: `Rp 6.300.000`.

---

## 2️⃣ DETAIL PRODUK

```
GET https://beliseken.com/api/products/{slug}
```

Contoh:
```
https://beliseken.com/api/products/lenovo-thinkpad-l13-gen-2
```

Response `data` berisi semua field list + tambahan:

| Field | Isi |
|-------|-----|
| `allImages` | Array URL semua foto produk (urut) |
| `images` | Sama dengan allImages |
| `specs` | Array spesifikasi `{ label, value }` |
| `units` | Array unit fisik tersedia (grade, skor kondisi, catatan, baterai) |
| `reviews` | 10 ulasan terakhir (nama user, rating, komentar) |
| `videoUrl` | URL video (bisa null) |
| `performanceNotes` | Catatan performa (bisa null) |
| `minusNotes` | Catatan minus/kekurangan (bisa null) |
| `warrantyNotes` | Catatan garansi (bisa null) |
| `totalReviews` | Jumlah ulasan |

Error 404:
```json
{ "success": false, "error": "Product not found" }
```

---

## 3️⃣ KATEGORI

```
GET https://beliseken.com/api/categories
```

Response: array kategori aktif + `subcategories` (nested) + `itemCount` per kategori.

---

## 4️⃣ BANNER / PROMO (homepage)

```
GET https://beliseken.com/api/banners
```

Filter opsional: `?type=hero` atau `?type=promo`.
Response: array banner dengan `imageUrl` (Cloudinary), `title`, `subtitle`, `linkUrl`.

---

## 5️⃣ AUTH (jika perlu login di app)

| Endpoint | Method | Body |
|----------|--------|------|
| `/api/auth/login` | POST | `{ "email": "...", "password": "..." }` |
| `/api/auth/register` | POST | `{ "name", "email", "password", "phone" }` |
| `/api/auth/login-phone` | POST | `{ "phone", "password" }` |
| `/api/auth/google` | GET | redirect OAuth (via WebView/Custom Tab) |

---

## 6️⃣ ORDER & PEMBAYARAN

| Endpoint | Method | Keterangan |
|----------|--------|------------|
| `/api/orders` | POST | Buat pesanan (checkout) |
| `/api/orders` | GET | Riwayat pesanan user |
| `/api/orders/{id}` | GET | Detail pesanan |
| `/api/cart/validate` | POST | Validasi keranjang sebelum checkout |
| `/api/payment/pakasir/create` | POST | Buat transaksi QRIS/VA → return payment URL |
| `/api/payment/pakasir/status?orderId=...` | GET | Cek status pembayaran |

---

## 7️⃣ Tips Implementasi

1. **Image loading:** pakai Coil / Glide, URL sudah auto-optimize (WebP, resize) dari Cloudinary.
2. **Pagination:** ikuti `meta.totalPages`, pakai `limit=20`.
3. **Caching:** respons API sudah kirim header cache; tetap sarankan cache di client (OkHttp Cache / Room) agar app terasa cepat.
4. **Rate/error:** kalau `success: false` → tampilkan `error` message.
5. **Jangan hardcode URL gambar** — selalu ambil dari `imageBase64` / `allImages` (bisa berubah dari base64 → Cloudinary kapan saja).

---

## 8️⃣ Uji Cepat (tanpa install apa pun)

```bash
# Daftar produk
curl "https://beliseken.com/api/products?limit=5"

# Detail produk
curl "https://beliseken.com/api/products/lenovo-thinkpad-l13-gen-2"

# Kategori
curl "https://beliseken.com/api/categories"
```
