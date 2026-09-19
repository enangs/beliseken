# 📋 BeliSeken.com - Konfigurasi Lengkap

**Terakhir diperbarui:** 19 September 2026  
**Versi:** 1.0.0  
**Status:** Production ✅

---

## 🌐 Website Overview

| Item | Detail |
|------|--------|
| **Domain** | beliseken.com |
| **URL** | https://beliseken.com |
| **Admin URL** | https://beliseken.com/admin |
| **API URL** | https://beliseken.com/api |
| **Status** | 🟢 Online |
| **SSL** | ✅ Valid (Vercel Auto) |

---

## 🖥️ Server & Hosting

### Vercel (Primary Hosting)

| Item | Detail |
|------|--------|
| **Platform** | Vercel |
| **Region** | Global (Edge Network) |
| **Auto Deploy** | ✅ GitHub integration |
| **Build Time** | ~50-60 seconds |
| **Node.js** | 18.x |
| **Bandwidth** | 100GB/month (Free plan) |

### Database (PostgreSQL)

| Item | Detail |
|------|--------|
| **Provider** | Vercel Postgres / Neon / Supabase |
| **Type** | PostgreSQL 15+ |
| **ORM** | Prisma 6.19.3 |
| **Tables** | 20+ tables |
| **Connection** | Connection pooling (PgBouncer) |

---

## ⚙️ Technology Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 14.2.35 | React framework |
| **React** | 18.3.1 | UI library |
| **TypeScript** | 5.x | Type safety |
| **Tailwind CSS** | 4.x | Styling |
| **Lucide React** | 1.33.0 | Icons |

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js API Routes** | 14.2.35 | REST API |
| **Prisma** | 6.19.3 | Database ORM |
| **NextAuth** | 5.0.0-beta.32 | Authentication |
| **JWT** | 9.0.3 | Token management |
| **bcryptjs** | 3.0.3 | Password hashing |

### Image & Media

| Technology | Version | Purpose |
|------------|---------|---------|
| **Cloudinary** | 2.11.0 | Image CDN & optimization |
| **next/image** | 14.2.35 | Image optimization |
| **qrcode.react** | 4.2.0 | QR code generation |

### Payment Gateway

| Technology | Status | Purpose |
|------------|--------|---------|
| **Pakasir** | ✅ Active | QRIS & VA payment |

### WhatsApp Integration

| Technology | Status | Purpose |
|------------|--------|---------|
| **Fonnte** | ✅ Active | WhatsApp notifications |

---

## 🗄️ Database Schema

### Tables Overview

| Module | Tables | Description |
|--------|--------|-------------|
| **Master Data** | Category, SubCategory, Brand, BrandModel, ConditionGrade | Product catalog |
| **Product** | Product, ProductUnit, ProductImage, ProductSpec, PriceHistory | Product management |
| **Procurement** | Supplier, PurchaseOrder, PurchaseOrderItem | Supplier management |
| **Inventory** | InventoryLog, StockReservation | Stock tracking |
| **User & Auth** | User, UserAddress | Customer management |
| **Orders** | Order, OrderItem, OrderStatusLog, PaymentLog, ShipmentLog | Order management |
| **Reviews** | Review, WishlistItem | Customer reviews |
| **CMS** | Banner, BlogPost, StoreSetting, AuditLog | Content management |
| **Sell Requests** | SellRequest | Jual Barang feature |

### Key Relationships

```
User ─┬── Order ──── OrderItem ──── Product
      ├── Review
      ├── WishlistItem
      └── UserAddress

Product ─┬── ProductUnit ──── ConditionGrade
         ├── ProductImage
         ├── ProductSpec
         ├── Review
         └── PriceHistory

Category ──── SubCategory ──── Product
Brand ──── BrandModel ──── Product
Supplier ──── PurchaseOrder ──── ProductUnit
```

---

## 🔐 Authentication & Security

### Authentication Methods

| Method | Status | Provider |
|--------|--------|----------|
| Email + Password | ✅ Active | NextAuth |
| Google OAuth | ✅ Active | Google |
| Phone OTP | ⏳ Planned | - |

### User Roles

| Role | Permissions |
|------|-------------|
| **SUPER_ADMIN** | Full access |
| **ADMIN** | Manage products, orders, customers |
| **CUSTOMER** | Browse, purchase, reviews |

### Security Headers

```javascript
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
```

---

## 💳 Payment Integration

### Pakasir Gateway

| Feature | Status |
|---------|--------|
| QRIS | ✅ Active |
| Virtual Account (VA) | ✅ Active |
| Bank Transfer | ✅ Active |
| E-Wallet | ⏳ Planned |

### Payment Flow

```
Customer → Checkout → Pakasir → QR/VA → Payment → Webhook → Order Update → WhatsApp Notify
```

---

## 📱 WhatsApp Notifications (Fonnte)

### Notification Types

| Event | Recipient | Message |
|-------|-----------|---------|
| New Order | Admin | "Pesanan baru #ORDER-XXX" |
| Payment Success | Admin + Customer | "Pembayaran lunas" |
| Order Shipped | Customer | "Pesanan dikirim" |
| Order Delivered | Customer | "Pesanan diterima" |

---

## 🖼️ Image Management (Cloudinary)

### Configuration

| Setting | Value |
|---------|-------|
| **Cloud Name** | (from env) |
| **API Key** | (from env) |
| **Folder** | beliseken/products |
| **Auto Optimization** | ✅ q_auto, f_auto |
| **Max Upload Size** | 10MB |
| **Allowed Formats** | JPG, PNG, WebP, GIF |

### Image Sizes

| Purpose | Dimensions | Quality |
|---------|------------|---------|
| Thumbnail | 400x300 | Auto |
| Medium | 800x600 | Auto |
| Large | 1200x900 | Auto |
| Original | Max 2048 | Auto |

---

## 🚀 Performance Optimization

### Caching Strategy

| Resource | Cache Duration |
|----------|----------------|
| Static assets (_next/static) | 1 year (immutable) |
| Images (/images) | 7 days |
| Icons (/icons) | 30 days |
| API responses | 5 minutes |
| HTML pages | 1 hour |

### Optimizations Implemented

| Optimization | Status |
|--------------|--------|
| Next.js Image optimization | ✅ |
| Cloudinary CDN | ✅ |
| Lazy loading | ✅ |
| Code splitting | ✅ |
| Bundle optimization | ✅ |
| Prefetch links | ✅ |
| Skeleton loading | ✅ |
| Content visibility | ✅ |

### Performance Scores

| Metric | Mobile | Desktop |
|--------|--------|---------|
| **Performance** | 67 → **75+** | 80 → **85+** |
| **Accessibility** | 82 | 87 |
| **Best Practices** | 100 | 100 |
| **SEO** | 100 | 100 |

---

## 📊 API Endpoints

### Public API

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/products` | GET | List products |
| `/api/products/[slug]` | GET | Product detail |
| `/api/categories` | GET | List categories |
| `/api/banners` | GET | Active banners |
| `/api/blog` | GET | Blog posts |
| `/api/search/suggest` | GET | Search suggestions |

### Protected API (Auth Required)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/login` | POST | Email login |
| `/api/auth/register` | POST | Registration |
| `/api/auth/google` | GET | Google OAuth |
| `/api/orders` | GET/POST | User orders |
| `/api/cart/validate` | POST | Validate cart |
| `/api/upload` | POST | Upload image |

### Admin API

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/admin/products` | CRUD | Manage products |
| `/api/admin/orders` | CRUD | Manage orders |
| `/api/admin/customers` | GET | List customers |
| `/api/admin/banners` | CRUD | Manage banners |
| `/api/admin/blog` | CRUD | Manage blog |

### Payment API

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/payment/pakasir/create` | POST | Create payment |
| `/api/payment/pakasir/status` | GET | Check status |
| `/api/webhooks/pakasir` | POST | Payment webhook |

---

## 🌍 Environment Variables

### Required Variables

```bash
# Database
DATABASE_URL=postgresql://...

# Authentication
NEXTAUTH_SECRET=your-secret
NEXTAUTH_URL=https://beliseken.com

# Google OAuth
GOOGLE_CLIENT_ID=xxx
GOOGLE_CLIENT_SECRET=xxx

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=xxx
NEXT_PUBLIC_CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx

# Payment (Pakasir)
PAKASIR_API_KEY=xxx

# WhatsApp (Fonnte)
FONNTE_API_KEY=xxx
ADMIN_WHATSAPP=085101256123

# Optional
NEXT_PUBLIC_DISABLE_CHECKOUT=false
```

---

## 📁 Project Structure

```
beliseken/
├── prisma/
│   ├── schema.prisma          # Database schema
│   ├── migrations/            # Database migrations
│   └── seed.ts               # Seed data
├── public/
│   ├── icons/                 # SVG icons
│   ├── images/                # Static images
│   └── .well-known/           # Asset links
├── scripts/
│   └── migrate-images-to-cloudinary.ts
├── src/
│   ├── app/
│   │   ├── api/               # API routes
│   │   ├── admin/             # Admin dashboard
│   │   ├── blog/              # Blog pages
│   │   ├── category/          # Category pages
│   │   ├── product/           # Product pages
│   │   ├── checkout/          # Checkout flow
│   │   └── dashboard/         # User dashboard
│   ├── components/
│   │   ├── admin/             # Admin components
│   │   └── ...                # Shared components
│   ├── lib/
│   │   ├── api.ts             # API client
│   │   ├── auth.ts            # Authentication
│   │   ├── cart.ts            # Cart logic
│   │   ├── cloudinary.ts      # Cloudinary config
│   │   ├── prisma.ts          # Database client
│   │   └── utils.ts           # Utilities
│   └── data/
│       └── products.ts        # Product data
├── next.config.mjs            # Next.js config
├── tailwind.config.ts         # Tailwind config
├── tsconfig.json              # TypeScript config
└── package.json               # Dependencies
```

---

## 🔧 Development Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run start            # Start production server

# Database
npm run db:seed          # Seed database
npm run db:reset         # Reset database
npm run db:studio        # Open Prisma Studio

# Migration
npx prisma migrate dev   # Run migrations
npx prisma generate      # Generate client

# Image Migration
npx tsx scripts/migrate-images-to-cloudinary.ts
```

---

## 📈 Monitoring & Analytics

| Service | Status | Purpose |
|---------|--------|---------|
| Vercel Analytics | ✅ | Performance monitoring |
| Google Analytics | ✅ | Traffic analytics |
| Facebook Pixel | ✅ | Ad tracking |
| PageSpeed Insights | ✅ | Performance testing |

---

## 🚦 Deployment Pipeline

```
Git Push → GitHub → Vercel Auto Deploy → Production
```

### Deployment Process

1. Push code to GitHub
2. Vercel detects changes
3. Build starts (~50s)
4. Tests & linting
5. Deploy to production
6. SSL certificate auto-renew

---

## 📞 Support & Contacts

| Channel | Contact |
|---------|---------|
| **WhatsApp** | 0851-0125-6123 |
| **Email** | info@beliseken.com |
| **Instagram** | @beliseken1 |
| **Website** | beliseken.com |

---

## 📝 Changelog

### v1.0.0 (19 September 2026)

- ✅ Initial release
- ✅ Cloudinary image optimization
- ✅ Performance optimization (next/image, caching)
- ✅ Limit homepage products (12)
- ✅ Skeleton loading states
- ✅ Prefetch links

---

**Document generated by Codebuff 🤖**
