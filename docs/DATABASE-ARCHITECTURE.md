# BeliSeken.com — Arsitektur Database & API

> **Senior Backend Engineer Documentation**
> Versi: 1.0 | Agustus 2026

---

## Table of Contents

1. [Overview & Tech Stack](#1-overview--tech-stack)
2. [Entity Relationship Diagram (ERD)](#2-entity-relationship-diagram)
3. [Prisma Schema Lengkap](#3-prisma-schema)
4. [Module 1: Master Data Management](#4-master-data-management)
5. [Module 2: Supplier & Pengadaan (Procurement)](#5-supplier--pengadaan)
6. [Module 3: Inventory & Product Management](#6-inventory--product-management)
7. [Module 4: Order Management System (OMS)](#7-order-management-system)
8. [RESTful API Structure](#8-restful-api-structure)
9. [Checkout Flow & Race Condition Prevention](#9-checkout-flow--race-condition)
10. [Business Logic Pseudocode](#10-business-logic-pseudocode)
11. [Migration Strategy](#11-migration-strategy)

---

## 1. Overview & Tech Stack

```
┌─────────────────────────────────────────────────────────────┐
│                    TECH STACK                                │
├─────────────────────────────────────────────────────────────┤
│  Frontend:     Next.js 16 (Static Export + PWA)            │
│  Backend API:  Next.js API Routes (App Router)             │
│  Database:     PostgreSQL 16                                │
│  ORM:          Prisma 6                                     │
│  Auth:         NextAuth.js v5 (Credentials + JWT)           │
│  Storage:      Cloudflare R2 / AWS S3 (foto produk)        │
│  Cache:        Redis (session, stock reservation)           │
│  Search:       Meilisearch (full-text search produk)        │
│  Queue:        BullMQ (email, webhook, async jobs)          │
│  Payment:      Midtrans / Xendit                            │
│  Shipping:     RajaOngkir API                               │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Entity Relationship Diagram

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  Category    │────<│  SubCategory │────<│   Product    │
│              │     │              │     │  (Template)  │
└──────────────┘     └──────────────┘     └──────┬───────┘
                                                  │
                          ┌───────────────────────┼───────────────────┐
                          │                       │                   │
                   ┌──────▼───────┐     ┌────────▼────────┐  ┌──────▼───────┐
                   │ ProductImage │     │  ProductUnit    │  │ ProductSpec  │
                   │              │     │  (Per-Item SKU) │  │              │
                   └──────────────┘     └────────┬────────┘  └──────────────┘
                                                  │
                          ┌───────────────────────┼───────────────────┐
                          │                       │                   │
                   ┌──────▼───────┐     ┌────────▼────────┐  ┌──────▼───────┐
                   │  Inventory   │     │   OrderItem     │  │  Condition   │
                   │  (Stock Log) │     │                 │  │  (Grade)     │
                   └──────────────┘     └────────┬────────┘  └──────────────┘
                                                  │
                   ┌──────────────┐     ┌────────▼────────┐
                   │   Supplier   │────<│   PurchaseOrder  │
                   │              │     │  (Pengadaan)     │
                   └──────────────┘     └────────┬────────┘
                                                  │
                                           ┌──────▼───────┐
                                           │  PO Item     │
                                           └──────────────┘

┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│    User      │────<│    Order     │────<│  OrderItem   │
│  (Customer)  │     │              │     │              │
└──────┬───────┘     └──────────────┘     └──────────────┘
       │
       ├────<┌──────────────┐
       │     │ UserAddress  │
       │     └──────────────┘
       │
       └────<┌──────────────┐
             │   Review     │
             └──────────────┘

┌──────────────┐     ┌──────────────┐
│    Banner    │     │  BlogPost    │
│  (Hero/Promo)│     │              │
└──────────────┘     └──────────────┘
```

---

## 3. Prisma Schema

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ══════════════════════════════════════════════════════════════
// MODULE 1: MASTER DATA
// ══════════════════════════════════════════════════════════════

model Category {
  id          String   @id @default(cuid())
  name        String   @unique
  slug        String   @unique
  icon        String?          // emoji icon
  color       String?          // hex color
  sortOrder   Int      @default(0)
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  subcategories SubCategory[]
  products      Product[]

  @@map("categories")
}

model SubCategory {
  id          String   @id @default(cuid())
  name        String
  slug        String   @unique
  categoryId  String
  sortOrder   Int      @default(0)
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  category  Category  @relation(fields: [categoryId], references: [id])
  products  Product[]

  @@unique([categoryId, name])
  @@map("subcategories")
}

model Brand {
  id          String   @id @default(cuid())
  name        String   @unique
  slug        String   @unique
  logoUrl     String?
  website     String?
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  models  BrandModel[]
  products Product[]

  @@map("brands")
}

model BrandModel {
  id          String   @id @default(cuid())
  name        String
  slug        String   @unique
  brandId     String
  imageUrl    String?
  specs       Json?    // Default specs template { ram: "8GB", storage: "256GB" }
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  brand     Brand     @relation(fields: [brandId], references: [id])
  products  Product[]

  @@unique([brandId, name])
  @@map("brand_models")
}

model ConditionGrade {
  id          String   @id @default(cuid())
  code        String   @unique  // "A", "B+", "B", "C", "D"
  name        String              // "Mulus (Grade A)"
  description String              // Deskripsi standar kondisi
  minScore    Int                  // Skor minimum (1-100)
  maxScore    Int                  // Skor maksimum
  priceModifier Decimal @default(1.0)  // Multiplier harga (1.0 = normal)
  sortOrder   Int      @default(0)
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  units ProductUnit[]

  @@map("condition_grades")
}

// ══════════════════════════════════════════════════════════════
// MODULE 2: PRODUCT (Template) vs UNIT (Per-Item SKU)
// ══════════════════════════════════════════════════════════════

model Product {
  // === Data Umum Produk (Template) ===
  id              String   @id @default(cuid())
  name            String                          // "MacBook Air M1 2020"
  slug            String   @unique
  sku             String   @unique                 // SKU template: "LAP-APL-MBA-M1"
  description     String?
  shortDesc       String?

  // === Relasi Master Data ===
  categoryId      String
  subcategoryId   String?
  brandId         String?
  modelId         String?

  // === Pricing (HPP & Margin) ===
  basePrice       Decimal                        // HPP / Harga beli dari supplier
  sellingPrice    Decimal                        // Harga jual normal
  minPrice        Decimal?                       // Harga minimum (diskon max)
  discount        Int       @default(0)           // Persen diskon

  // === Physical Info ===
  weight          Int?                           // gram
  dimensions      String?                        // PxLxT cm

  // === SEO & Meta ===
  metaTitle       String?
  metaDesc        String?
  ogImage         String?

  // === Status ===
  isActive        Boolean  @default(true)
  isFeatured      Boolean  @default(false)
  badge           String?                        // "HOT DEAL", "BEST SELLER", "NEW"
  sortOrder       Int      @default(0)

  // === Stats (denormalized for performance) ===
  avgRating       Decimal  @default(0)
  reviewCount     Int      @default(0)
  soldCount       Int      @default(0)
  viewCount       Int      @default(0)

  // === Timestamps ===
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  publishedAt     DateTime?

  // === Relations ===
  category        Category       @relation(fields: [categoryId], references: [id])
  subcategory     SubCategory?   @relation(fields: [subcategoryId], references: [id])
  brand           Brand?         @relation(fields: [brandId], references: [id])
  model           BrandModel?    @relation(fields: [modelId], references: [id])

  units           ProductUnit[]
  images          ProductImage[]
  specs           ProductSpec[]
  reviews         Review[]
  orderItems      OrderItem[]
  wishlistItems   WishlistItem[]
  priceHistory    PriceHistory[]

  @@index([categoryId])
  @@index([brandId])
  @@index([sellingPrice])
  @@index([isActive, isFeatured])
  @@map("products")
}

model ProductUnit {
  // === Data Spesifik Per Unit (Karena Barang Bekas = Unik) ===
  id              String   @id @default(cuid())
  productId       String
  unitSku         String   @unique                 // SKU unik per unit: "LAP-APL-MBA-M1-001"
  serialNumber    String?                          // Serial number fisik (opsional)

  // === Kondisi ===
  conditionGradeId String
  conditionScore   Int                             // Skor 1-100
  conditionNotes   String?                         // "Ada lecet kecil di sudut kiri"
  batteryHealth    Int?                            // Persen baterai (untuk laptop/HP)
  cosmeticNotes    String?                         // Catatan kosmetik detail

  // === Harga Per Unit ===
  purchasePrice    Decimal                         // Harga beli unit ini (HPP)
  sellingPrice     Decimal                         // Harga jual unit ini
  originalPrice    Decimal?                        // Harga baru saat masih baru

  // === Stok & Status ===
  status           UnitStatus @default(AVAILABLE)
  // AVAILABLE = Ready stok
  // RESERVED = Ada di keranjang/checkout (belum bayar)
  // SOLD = Sudah terjual
  // IN_REPAIR = Sedang diperbaiki
  // QUARANTINE = Masih dalam inspeksi

  // === Foto Unit Spesifik ===
  mainPhoto        String?                         // Foto utama unit ini
  additionalPhotos String[]                        // Foto detail: lecet, dll

  // === Inspeksi ===
  inspectedAt      DateTime?
  inspectedBy      String?                         // Nama petugas inspeksi
  warrantyExpiry   DateTime?                       // Garansi toko (30 hari dari beli)

  // === Supplier Info ===
  supplierId       String?
  purchaseDate     DateTime?
  purchaseOrderId  String?

  // === Timestamps ===
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt

  // === Relations ===
  product           Product          @relation(fields: [productId], references: [id])
  conditionGrade    ConditionGrade   @relation(fields: [conditionGradeId], references: [id])
  supplier          Supplier?        @relation(fields: [supplierId], references: [id])
  purchaseOrder     PurchaseOrder?   @relation(fields: [purchaseOrderId], references: [id])
  inventoryLogs     InventoryLog[]
  orderItems        OrderItem[]
  reservations      StockReservation[]

  @@index([productId, status])
  @@index([status])
  @@index([unitSku])
  @@map("product_units")
}

model ProductImage {
  id          String   @id @default(cuid())
  productId   String
  url         String
  alt         String?
  sortOrder   Int      @default(0)
  isPrimary   Boolean  @default(false)

  product Product @relation(fields: [productId], references: [id], onDelete: Cascade)

  @@map("product_images")
}

model ProductSpec {
  id          String   @id @default(cuid())
  productId   String
  key         String                         // "RAM", "Storage", "Processor"
  value       String                         // "8GB", "256GB SSD", "M1 Chip"
  sortOrder   Int      @default(0)

  product Product @relation(fields: [productId], references: [id], onDelete: Cascade)

  @@unique([productId, key])
  @@map("product_specs")
}

model PriceHistory {
  id          String   @id @default(cuid())
  productId   String
  oldPrice    Decimal
  newPrice    Decimal
  reason      String?                        // "Diskon akhir tahun", "HPP naik"
  changedBy   String?                        // Admin ID

  product   Product   @relation(fields: [productId], references: [id])
  createdAt DateTime  @default(now())

  @@map("price_history")
}

// ══════════════════════════════════════════════════════════════
// MODULE 3: SUPPLIER & PENGADAAN (PROCUREMENT)
// ══════════════════════════════════════════════════════════════

model Supplier {
  id          String   @id @default(cuid())
  name        String                          // "Toko Bekas Jakarta"
  code        String   @unique                 // "SUP-001"
  type        SupplierType @default(BORONGAN)
  // BORONGAN = Supplier borongan (partai)
  // INDIVIDUAL = User yang jual barang ke toko
  // TRADE_IN = Customer tukar tambah

  contactName String?
  phone       String?
  email       String?
  address     String?
  city        String?

  // === Rating & Stats ===
  rating      Decimal  @default(0)
  totalDeals  Int      @default(0)
  totalValue  Decimal  @default(0)

  // === Status ===
  isActive    Boolean  @default(true)
  notes       String?

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  units            ProductUnit[]
  purchaseOrders   PurchaseOrder[]
  purchaseOrderItems PurchaseOrderItem[]

  @@map("suppliers")
}

model PurchaseOrder {
  // === PO = Pengadaan Barang dari Supplier ===
  id              String   @id @default(cuid())
  poNumber        String   @unique              // "PO-20260801-001"
  supplierId      String

  // === Status ===
  status          POStatus @default(DRAFT)
  // DRAFT = Belum dikirim
  // SENT = PO sudah dikirim ke supplier
  // RECEIVED = Barang sudah diterima
  // INSPECTING = Sedang inspeksi
  // COMPLETED = Selesai (semua unit sudah di-inspeksi)
  // CANCELLED = Dibatalkan

  // === Financial ===
  totalCost       Decimal  @default(0)        // Total HPP
  totalItems      Int      @default(0)        // Jumlah unit yang dipesan
  paymentStatus   PaymentStatus @default(UNPAID)
  // UNPAID, PARTIAL, PAID
  paidAmount      Decimal  @default(0)

  // === Notes ===
  notes           String?
  expectedDate    DateTime?                   // Tanggal estimasi barang datang
  receivedAt      DateTime?

  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  supplier        Supplier    @relation(fields: [supplierId], references: [id])
  items           PurchaseOrderItem[]
  units           ProductUnit[]

  @@index([supplierId])
  @@index([status])
  @@map("purchase_orders")
}

model PurchaseOrderItem {
  id              String   @id @default(cuid())
  purchaseOrderId String
  supplierId      String
  productId       String?                      // Bisa kosong jika produk baru
  productName     String                       // Nama barang yang dipesan
  quantity        Int
  unitCost        Decimal                      // Harga per unit
  totalCost       Decimal                      // quantity × unitCost
  conditionGrade  String?                      // Grade yang diharapkan ("A", "B+")
  notes           String?

  purchaseOrder PurchaseOrder @relation(fields: [purchaseOrderId], references: [id])
  supplier      Supplier      @relation(fields: [supplierId], references: [id])
  product       Product?      @relation(fields: [productId], references: [id])

  @@map("purchase_order_items")
}

// ══════════════════════════════════════════════════════════════
// MODULE 4: INVENTORY MANAGEMENT
// ══════════════════════════════════════════════════════════════

enum UnitStatus {
  AVAILABLE     // Ready stok, bisa dibeli
  RESERVED      // Di keranjang/checkout, belum bayar
  SOLD          // Sudah terjual
  IN_REPAIR     // Sedang diperbaiki
  QUARANTINE    // Masih inspeksi
  RETURNED      // Dikembalikan
}

model InventoryLog {
  id          String   @id @default(cuid())
  unitId      String
  action      InventoryAction
  // CREATED       = Unit baru ditambahkan (dari PO)
  // INSPECTED     = Hasil inspeksi
  // STATUS_CHANGE = Perubahan status
  // PRICE_CHANGE  = Perubahan harga
  // SOLD          = Terjual
  // RETURNED      = Dikembalikan
  // ADJUSTED      = Koreksi manual

  fromStatus  UnitStatus?
  toStatus    UnitStatus?
  notes       String?
  performedBy String?                       // Admin ID / System
  metadata    Json?                         // Data tambahan (harga lama/baru, dll)

  unit      ProductUnit @relation(fields: [unitId], references: [id])
  createdAt DateTime    @default(now())

  @@index([unitId])
  @@index([action])
  @@index([createdAt])
  @@map("inventory_logs")
}

enum InventoryAction {
  CREATED
  INSPECTED
  STATUS_CHANGE
  PRICE_CHANGE
  SOLD
  RETURNED
  ADJUSTED
}

model StockReservation {
  // === Reserved stok saat user checkout (sebelum bayar) ===
  id          String   @id @default(cuid())
  unitId      String
  userId      String?
  sessionId   String?                       // Untuk anonymous user
  orderId     String?                       // Setelah order dibuat

  expiresAt   DateTime                      // auto-release setelah 30 menit
  isActive    Boolean  @default(true)

  unit      ProductUnit @relation(fields: [unitId], references: [id])
  createdAt DateTime    @default(now())

  @@index([unitId, isActive])
  @@index([expiresAt])
  @@map("stock_reservations")
}

// ══════════════════════════════════════════════════════════════
// MODULE 5: USER & AUTH
// ══════════════════════════════════════════════════════════════

enum UserRole {
  CUSTOMER
  ADMIN
  SUPER_ADMIN
}

model User {
  id          String   @id @default(cuid())
  email       String   @unique
  password    String                           // bcrypt hashed
  name        String
  phone       String?
  role        UserRole @default(CUSTOMER)
  avatarUrl   String?
  isActive    Boolean  @default(true)
  lastLoginAt DateTime?

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  addresses   UserAddress[]
  orders      Order[]
  reviews     Review[]
  wishlistItems WishlistItem[]

  @@map("users")
}

model UserAddress {
  id          String   @id @default(cuid())
  userId      String
  label       String                           // "Rumah", "Kantor"
  name        String
  phone       String
  email       String?
  address     String                           // Alamat lengkap
  city        String
  cityId      String                           // ID RajaOngkir
  district    String?
  districtId  String?
  province    String
  provinceId  String
  postcode    String?
  isDefault   Boolean  @default(false)
  isActive    Boolean  @default(true)

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  user  User  @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@map("user_addresses")
}

// ══════════════════════════════════════════════════════════════
// MODULE 6: ORDER MANAGEMENT SYSTEM (OMS)
// ══════════════════════════════════════════════════════════════

enum OrderStatus {
  PENDING             // Menunggu konfirmasi
  WAITING_PAYMENT     // Menunggu pembayaran
  PAID                // Sudah bayar, menunggu diproses
  PROCESSING          // Sedang diproses / dikemas
  SHIPPING            // Sedang dikirim
  DELIVERED           // Sudah sampai
  COMPLETED           // Selesai
  CANCELLED           // Dibatalkan
  REFUNDED            // Sudah refund
}

enum PaymentMethod {
  BANK_TRANSFER
  E_WALLET
  QRIS
  COD
  CREDIT_CARD
}

enum PaymentStatus {
  UNPAID
  PAID
  PARTIAL
  REFUNDED
}

enum PaymentProvider {
  MIDTRANS
  XENDIT
  MANUAL
}

model Order {
  id              String   @id @default(cuid())
  orderNumber     String   @unique              // "BS-20260822-0001"
  userId          String?

  // === Status ===
  status          OrderStatus @default(PENDING)
  paymentStatus   PaymentStatus @default(UNPAID)
  paymentMethod   PaymentMethod
  paymentProvider PaymentProvider?
  paymentRef      String?                       // Referensi dari payment gateway
  paidAt          DateTime?

  // === Pricing ===
  subtotal        Decimal                        // Total harga produk
  discount        Decimal  @default(0)
  shippingCost    Decimal  @default(0)
  insuranceCost   Decimal  @default(0)
  total           Decimal                        // Final amount

  // === Shipping ===
  courier         String                         // "jne", "jnt", "sicepat"
  shippingService String                         // "REG", "OKE", "YES"
  shippingEtd     String?                        // "2-3 hari"
  trackingNumber  String?
  shippedAt       DateTime?
  deliveredAt     DateTime?

  // === Address Snapshot (di-snapshot saat order) ===
  addressSnapshot Json                            // Alamat lengkap

  // === Notes ===
  customerNotes   String?
  adminNotes      String?

  // === Timestamps ===
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  expiresAt       DateTime?                       // Auto-cancel jika tidak bayar (30 menit)

  // === Relations ===
  user            User?          @relation(fields: [userId], references: [id])
  items           OrderItem[]
  statusHistory   OrderStatusLog[]
  paymentLogs     PaymentLog[]
  shipments       ShipmentLog[]
  invoices        Invoice[]

  @@index([userId])
  @@index([status])
  @@index([orderNumber])
  @@index([createdAt])
  @@map("orders")
}

model OrderItem {
  id          String   @id @default(cuid())
  orderId     String
  unitId      String                         // Referensi ke unit spesifik
  productId   String

  // === Snapshot data saat order ===
  productName String
  productSlug String
  productImage String?
  unitSku     String
  gradeCode   String?                        // "A", "B+"
  price       Decimal
  quantity    Int      @default(1)
  subtotal    Decimal

  // === HPP (untuk hitung laba) ===
  purchasePrice Decimal?                     // HPP unit ini
  margin        Decimal?                     // Laba kotor per item

  order   Order        @relation(fields: [orderId], references: [id], onDelete: Cascade)
  unit    ProductUnit  @relation(fields: [unitId], references: [id])
  product Product      @relation(fields: [productId], references: [id])

  @@map("order_items")
}

model OrderStatusLog {
  id          String   @id @default(cuid())
  orderId     String
  status      OrderStatus
  note        String?
  changedBy   String?                         // Admin ID / System
  createdAt   DateTime @default(now())

  order Order @relation(fields: [orderId], references: [id], onDelete: Cascade)

  @@index([orderId])
  @@map("order_status_logs")
}

model PaymentLog {
  id          String   @id @default(cuid())
  orderId     String
  amount      Decimal
  method      PaymentMethod
  provider    PaymentProvider?
  reference   String?                         // Transaction ID dari gateway
  status      String                          // "success", "pending", "failed"
  rawResponse Json?                           // Raw response dari gateway
  createdAt   DateTime @default(now())

  order Order @relation(fields: [orderId], references: [id])

  @@index([orderId])
  @@map("payment_logs")
}

model ShipmentLog {
  id          String   @id @default(cuid())
  orderId     String
  courier     String
  service     String
  trackingNo  String
  status      String                          // "manifested", "in_transit", "delivered"
  location    String?
  timestamp   DateTime
  rawPayload  Json?

  order Order @relation(fields: [orderId], references: [id])

  @@index([orderId])
  @@index([trackingNo])
  @@map("shipment_logs")
}

model Invoice {
  id              String   @id @default(cuid())
  orderId         String
  invoiceNumber   String   @unique              // "INV-20260822-0001"
  subtotal        Decimal
  tax             Decimal  @default(0)
  total           Decimal
  status          String   @default("issued")   // issued, paid, void
  issuedAt        DateTime @default(now())
  paidAt          DateTime?

  order Order @relation(fields: [orderId], references: [id])

  @@map("invoices")
}

// ══════════════════════════════════════════════════════════════
// MODULE 7: REVIEW & WISHLIST
// ══════════════════════════════════════════════════════════════

model Review {
  id          String   @id @default(cuid())
  productId   String
  userId      String
  orderId     String?                          // Review hanya dari pembeli
  rating      Int                               // 1-5
  comment     String?
  photos      String[]                          // Foto review
  isVerified  Boolean  @default(false)          // Verified purchase
  isApproved  Boolean  @default(true)
  helpful     Int      @default(0)              // "Helpful" count

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  product Product @relation(fields: [productId], references: [id])
  user    User    @relation(fields: [userId], references: [id])

  @@unique([productId, userId, orderId])
  @@map("reviews")
}

model WishlistItem {
  id          String   @id @default(cuid())
  userId      String
  productId   String

  createdAt   DateTime @default(now())

  user    User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  product Product @relation(fields: [productId], references: [id], onDelete: Cascade)

  @@unique([userId, productId])
  @@map("wishlist_items")
}

// ══════════════════════════════════════════════════════════════
// MODULE 8: CMS (Content Management)
// ══════════════════════════════════════════════════════════════

model Banner {
  id          String   @id @default(cuid())
  type        BannerType @default(HERO)
  title       String
  subtitle    String?
  description String?
  imageUrl    String?
  gradient    String?                         // CSS gradient fallback
  ctaText     String?
  ctaLink     String?
  isActive    Boolean  @default(true)
  sortOrder   Int      @default(0)

  startDate   DateTime?
  endDate     DateTime?

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@map("banners")
}

enum BannerType {
  HERO
  PROMO_CARD
  POPUP
  SIDEBAR
}

model BlogPost {
  id          String   @id @default(cuid())
  title       String
  slug        String   @unique
  excerpt     String?
  content     String?                          // Rich text / Markdown
  imageUrl    String?
  category    String?
  tags        String[]
  isPublished Boolean  @default(false)
  isFeatured  Boolean  @default(false)
  viewCount   Int      @default(0)

  authorId    String?
  authorName  String   @default("Admin")

  publishedAt DateTime?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@map("blog_posts")
}

// ══════════════════════════════════════════════════════════════
// MODULE 9: SETTINGS & CONFIG
// ══════════════════════════════════════════════════════════════

model StoreSetting {
  id          String   @id @default(cuid())
  key         String   @unique
  value       String
  type        String   @default("text")        // text, number, boolean, json
  group       String   @default("general")     // general, shipping, payment, seo
  updatedAt   DateTime @updatedAt

  @@map("store_settings")
}

model AuditLog {
  id          String   @id @default(cuid())
  userId      String?
  action      String                          // "product.create", "order.update"
  entityType  String                          // "Product", "Order"
  entityId    String
  oldValues   Json?
  newValues   Json?
  ipAddress   String?
  createdAt   DateTime @default(now())

  @@index([entityType, entityId])
  @@index([userId])
  @@index([createdAt])
  @@map("audit_logs")
}
```

---

## 4. Master Data Management

### 4.1 Kategori & Sub-Kategori

```
Laptop & Notebook
  ├── Ultrabook
  ├── Laptop Gaming
  ├── Laptop Kantor
  └── Workstation

Smartphone & Tablet
  ├── Smartphone
  ├── Tablet
  └── Aksesoris HP

Monitor & TV
  ├── Monitor
  ├── Monitor Gaming
  ├── TV
  └── Projector

Networking & IT
  ├── Router
  ├── Access Point
  ├── Switch
  ├── NAS
  └── Server

Peripheral & Aksesoris
  ├── Mouse
  ├── Mouse Gaming
  ├── Keyboard
  ├── Keyboard Mechanical
  ├── Headphone
  ├── Headset Gaming
  ├── Webcam
  ├── Charger
  └── Lainnya
```

### 4.2 Master Brand & Model

```
Apple
  ├── MacBook Air M1
  ├── MacBook Air M2
  ├── MacBook Pro 14 M1 Pro
  ├── MacBook Pro 16 M1 Max
  ├── iPhone 12 Mini
  ├── iPhone 13 Pro
  ├── iPhone 14
  └── iPad Air M1

Lenovo
  ├── ThinkPad X1 Carbon Gen 9
  ├── ThinkPad T480
  └── IdeaPad Slim 3

... (dst untuk semua brand)
```

### 4.3 Master Kondisi (Grading)

| Code | Nama | Skor | Deskripsi Standar | Multiplier |
|------|------|------|-------------------|------------|
| `A+` | Like New | 95-100 | Seperti baru, tidak ada lecet, baterai >90%, semua fungsi normal | 1.0 |
| `A` | Mulus | 85-94 | Sangat mulus, lecet sangat minor (tidak terlihat), baterai >80%, semua fungsi normal | 0.9 |
| `B+` | Bagus | 75-84 | Ada lecet pemakaian wajar, baterai >70%, semua fungsi normal | 0.8 |
| `B` | Biasa | 65-74 | Lecet terlihat, baterai >60%, fungsi normal | 0.7 |
| `C` | Minus | 50-64 | Lecet/baret, ada minor issue (misal: speaker kiri mati), baterai >40% | 0.5 |
| `D` | Rusak Ringan | 30-49 | Fungsi ada yang tidak jalan, bisa diperbaiki | 0.3 |

---

## 5. Supplier & Pengadaan

### 5.1 Tipe Supplier

| Tipe | Deskripsi | Contoh |
|------|-----------|--------|
| `BORONGAN` | Supplier borongan / partai | "Laptop Bekas Jakarta", "Ex-Office IT Surabaya" |
| `INDIVIDUAL` | User yang jual barang ke toko | User daftar → jual MacBook → toko beli |
| `TRADE_IN` | Customer tukar tambah | Beli iPhone 14, tukar iPhone 12 |

### 5.2 Alur Pengadaan (Procurement Flow)

```
1. Admin buat Purchase Order (PO)
   ├── Pilih supplier
   ├── Tambah item: nama barang, qty, harga satuan
   └── Simpan sebagai DRAFT

2. Kirim PO ke supplier
   └── Status: DRAFT → SENT

3. Barang datang, diterima
   ├── Status: SENT → RECEIVED
   ├── Buat ProductUnit untuk setiap item
   ├── Setiap unit dapat serial number unik
   └── Assign ke QUARANTINE (belum inspeksi)

4. Inspeksi barang
   ├── Cek kondisi fisik
   ├── Isi conditionScore (1-100)
   ├── Assign ConditionGrade (A, B+, B, C)
   ├── Foto kondisi (lecet, minus, dll)
   ├── Status: QUARANTINE → AVAILABLE
   └── Tentukan sellingPrice berdasarkan:
       ├── basePrice (HPP dari PO)
       ├── × conditionGrade.priceModifier
       └── + margin keuntungan

5. Barang siap dijual
   └── Status: AVAILABLE (muncul di website)
```

---

## 6. Inventory & Product Management

### 6.1 SKU System untuk Barang Bekas

Karena setiap unit barang bekas UNIK (kondisi berbeda), kita gunakan **2 level SKU**:

```
Level 1: Product SKU (Template)
  Format: {Kategori}-{Brand}-{Model}-{Versi}
  Contoh: LAP-APL-MBA-M1 → MacBook Air M1 (semua unit)

Level 2: Unit SKU (Per-Item)
  Format: {ProductSKU}-{Nomor Urut}
  Contoh: LAP-APL-MBA-M1-001 → Unit pertama MacBook Air M1
          LAP-APL-MBA-M1-002 → Unit kedua (kondisi berbeda!)
```

### 6.2 Status Unit

```
QUARANTINE → AVAILABLE → RESERVED → SOLD
    │            │          │
    │            │          └──→ AVAILABLE (jika tidak jadi beli)
    │            │
    │            ├──→ IN_REPAIR → AVAILABLE
    │            │
    │            └──→ RETURNED (jika barang dikembalikan)
    │
    └──→ IN_REPAIR → AVAILABLE
```

### 6.3 Stock Display di Frontend

```
Product Page:
┌─────────────────────────────────────────┐
│  MacBook Air M1 2020                    │
│  Grade: A                               │
│  ─────────────────────────              │
│  Harga: Rp 6.500.000                   │
│  Sisa stok: 3 unit tersedia            │  ← Dihitung dari unit AVAILABLE
│                                         │
│  Kondisi:                              │
│  • Unit 1: Grade A, 95% baterai       │
│  • Unit 2: Grade A+, 92% baterai      │
│  • Unit 3: Grade B+, 88% baterai      │
│                                         │
│  [Masukkan ke Keranjang]               │
└─────────────────────────────────────────┘
```

---

## 7. Order Management System

### 7.1 Order Status Flow

```
                    ┌──────────────┐
                    │   PENDING    │ (Pesanan dibuat)
                    └──────┬───────┘
                           │
              ┌────────────┼────────────┐
              │            │            │
         ┌────▼───┐  ┌────▼───┐  ┌────▼───┐
         │  PAID  │  │CANCELLED│  │CANCELLED│
         │(Online)│  │(timeout)│  │(user)   │
         └────┬───┘  └────────┘  └────────┘
              │
         ┌────▼────────┐
         │  PROCESSING │ (Barang dikemas)
         └────┬────────┘
              │
         ┌────▼────────┐
         │  SHIPPING   │ (Dikirim, ada tracking)
         └────┬────────┘
              │
         ┌────▼────────┐
         │  DELIVERED  │ (Sampai di tujuan)
         └────┬────────┘
              │
         ┌────▼────────┐
         │  COMPLETED  │ (Selesai, bisa review)
         └─────────────┘
```

### 7.2 COD Flow

```
PENDING → PROCESSING → SHIPPING → DELIVERED → COMPLETED
                                         │
                                    (bayar di tempat)
                                         │
                                    paymentStatus: PAID
```

### 7.3 Auto-Cancel Flow

```
Jika order status = PENDING atau WAITING_PAYMENT
   DAN sudah > 30 menit:
   ├── Update status: CANCELLED
   ├── Release semua reserved stok → AVAILABLE
   └── Log: "Pesanan otomatis dibatalkan (timeout pembayaran)"
```

---

## 8. RESTful API Structure

### 8.1 API Endpoints

```
BASE URL: https://api.beliseken.com/v1

═══════════════════════════════════════════════
AUTH
═══════════════════════════════════════════════
POST   /auth/register              Register customer
POST   /auth/login                 Login (return JWT)
POST   /auth/logout                Logout
GET    /auth/me                    Get current user
PUT    /auth/me                    Update profile
POST   /auth/change-password       Change password

═══════════════════════════════════════════════
PRODUCTS (Public)
═══════════════════════════════════════════════
GET    /products                   List products (with filters)
GET    /products/:slug             Get product by slug
GET    /products/:slug/units       Get available units
GET    /products/featured          Featured products
GET    /products/flash-sale        Flash sale products
GET    /products/search?q=         Search products
GET    /products/compare?ids=      Compare products

═══════════════════════════════════════════════
CATEGORIES
═══════════════════════════════════════════════
GET    /categories                 List all categories
GET    /categories/:slug           Category detail + products
GET    /categories/:slug/products  Products in category

═══════════════════════════════════════════════
CART (Client-side localStorage, tapi validasi server-side)
═══════════════════════════════════════════════
POST   /cart/validate              Validate cart items (cek stok)
POST   /cart/reserve               Reserve stock (saat checkout)
DELETE /cart/reserve/:id           Release reserved stock

═══════════════════════════════════════════════
ORDERS
═══════════════════════════════════════════════
POST   /orders                     Create order
GET    /orders                     List user's orders
GET    /orders/:orderNumber        Get order detail
POST   /orders/:id/pay             Process payment
POST   /orders/:id/cancel          Cancel order
GET    /orders/:id/tracking        Get tracking info

═══════════════════════════════════════════════
SHIPPING
═══════════════════════════════════════════════
POST   /shipping/calculate         Calculate shipping cost
GET    /shipping/provinces         List provinces (RajaOngkir)
GET    /shipping/cities/:provinceId  List cities
GET    /shipping/track/:trackingNo   Track shipment

═══════════════════════════════════════════════
REVIEWS
═══════════════════════════════════════════════
GET    /products/:slug/reviews     Get product reviews
POST   /reviews                    Create review (verified purchase)
POST   /reviews/:id/helpful       Mark review as helpful

═══════════════════════════════════════════════
WISHLIST
═══════════════════════════════════════════════
GET    /wishlist                   Get user's wishlist
POST   /wishlist                   Add to wishlist
DELETE /wishlist/:productId        Remove from wishlist

═══════════════════════════════════════════════
USER ADDRESS
═══════════════════════════════════════════════
GET    /addresses                  Get user's addresses
POST   /addresses                  Add address
PUT    /addresses/:id              Update address
DELETE /addresses/:id              Delete address

═══════════════════════════════════════════════
BLOG (Public)
═══════════════════════════════════════════════
GET    /blog                       List posts
GET    /blog/:slug                 Get post

═══════════════════════════════════════════════
ADMIN (Protected: requires ADMIN role)
═══════════════════════════════════════════════
GET    /admin/dashboard            Dashboard stats
GET    /admin/products             List all products
POST   /admin/products             Create product
PUT    /admin/products/:id         Update product
DELETE /admin/products/:id         Delete product

GET    /admin/units                List all units
POST   /admin/units                Create unit
PUT    /admin/units/:id            Update unit
POST   /admin/units/:id/inspect    Inspect unit

GET    /admin/orders               List all orders
PUT    /admin/orders/:id/status    Update order status
POST   /admin/orders/:id/ship      Ship order

GET    /admin/suppliers            List suppliers
POST   /admin/suppliers            Create supplier
PUT    /admin/suppliers/:id        Update supplier

GET    /admin/purchase-orders      List POs
POST   /admin/purchase-orders      Create PO
PUT    /admin/purchase-orders/:id  Update PO
POST   /admin/purchase-orders/:id/receive  Receive PO

GET    /admin/customers            List customers
GET    /admin/customers/:id        Customer detail

GET    /admin/banners              List banners
POST   /admin/banners              Create banner
PUT    /admin/banners/:id          Update banner
DELETE /admin/banners/:id          Delete banner

GET    /admin/blog                 List blog posts
POST   /admin/blog                 Create post
PUT    /admin/blog/:id             Update post
DELETE /admin/blog/:id             Delete post

GET    /admin/inventory/logs       Inventory logs
GET    /admin/inventory/low-stock  Low stock alerts

GET    /admin/reports/sales        Sales report
GET    /admin/reports/products     Product performance
GET    /admin/reports/inventory    Inventory valuation
```

### 8.2 API Response Format

```typescript
// Standard Success Response
{
  "success": true,
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}

// Standard Error Response
{
  "success": false,
  "error": {
    "code": "STOCK_UNAVAILABLE",
    "message": "Unit LAP-APL-MBA-M1-001 tidak lagi tersedia",
    "details": {
      "unitId": "abc123",
      "currentStatus": "SOLD"
    }
  }
}
```

### 8.3 Query Parameters (Filter & Pagination)

```
GET /products?
  category=laptop-notebook
  &brand=apple
  &condition=A,B+
  &minPrice=3000000
  &maxPrice=10000000
  &inStock=true
  &sort=price_asc
  &page=1
  &limit=20
```

---

## 9. Checkout Flow & Race Condition Prevention

### 9.1 Masalah Race Condition

```
Skenario Race Condition:
─────────────────────────
User A dan User B buka halaman yang sama (MacBook Air M1, 1 unit tersisa)

1. User A klik "Checkout" → cek stok → AVAILABLE ✅
2. User B klik "Checkout" → cek stok → AVAILABLE ✅ (BELUM di-update!)
3. User A bayar → stok dipotong → SOLD
4. User B bayar → stok sudah SOLD → ❌ OVERSELLING!
```

### 9.2 Solusi: Database Locking + Reservation

```
ALUR CHECKOUT YANG AMAN:
═══════════════════════════

Step 1: Reserve Stock (OPTIMISTIC LOCKING)
──────────────────────────────────────────
  BEGIN TRANSACTION;
  
  -- Cek apakah unit masih AVAILABLE
  SELECT status FROM product_units 
  WHERE id = ? AND status = 'AVAILABLE'
  FOR UPDATE;  -- ← Row lock! User lain harus tunggu
  
  -- Jika AVAILABLE, ubah ke RESERVED
  UPDATE product_units 
  SET status = 'RESERVED'
  WHERE id = ? AND status = 'AVAILABLE';
  
  -- Buat reservation record
  INSERT INTO stock_reservations (unitId, userId, expiresAt)
  VALUES (?, ?, NOW() + INTERVAL '30 minutes');
  
  COMMIT;

Step 2: Create Order
─────────────────────
  -- Order dibuat dengan status WAITING_PAYMENT
  -- Setiap item = 1 unit yang sudah di-RESERVED

Step 3: Payment Gateway
────────────────────────
  -- Redirect ke Midtrans/Xendit
  -- Callback ke /webhooks/payment

Step 4a: Payment SUCCESS
─────────────────────────
  BEGIN TRANSACTION;
  
  -- Update order status
  UPDATE orders SET status = 'PAID', paidAt = NOW()
  WHERE id = ?;
  
  -- Update unit status: RESERVED → SOLD
  UPDATE product_units SET status = 'SOLD'
  WHERE id IN (SELECT unitId FROM order_items WHERE orderId = ?);
  
  -- Update product stats
  UPDATE products SET soldCount = soldCount + ?
  WHERE id IN (SELECT productId FROM order_items WHERE orderId = ?);
  
  -- Log inventory
  INSERT INTO inventory_logs (unitId, action, fromStatus, toStatus)
  SELECT unitId, 'SOLD', 'RESERVED', 'SOLD'
  FROM order_items WHERE orderId = ?;
  
  COMMIT;

Step 4b: Payment FAILED / TIMEOUT
──────────────────────────────────
  BEGIN TRANSACTION;
  
  -- Update order status
  UPDATE orders SET status = 'CANCELLED'
  WHERE id = ?;
  
  -- Release reserved stock: RESERVED → AVAILABLE
  UPDATE product_units SET status = 'AVAILABLE'
  WHERE id IN (SELECT unitId FROM order_items WHERE orderId = ?)
  AND status = 'RESERVED';
  
  -- Delete reservation
  DELETE FROM stock_reservations
  WHERE orderId = ?;
  
  COMMIT;
```

### 9.3 Reservation Cleanup (Background Job)

```typescript
// Jalankan setiap 1 menit via cron job / BullMQ
async function cleanupExpiredReservations() {
  // 1. Cari reservation yang sudah expired
  const expired = await prisma.stockReservation.findMany({
    where: {
      isActive: true,
      expiresAt: { lt: new Date() }
    }
  });

  // 2. Release stok untuk setiap expired reservation
  for (const reservation of expired) {
    await prisma.$transaction(async (tx) => {
      // Update unit status: RESERVED → AVAILABLE
      await tx.productUnit.update({
        where: { id: reservation.unitId },
        data: { status: 'AVAILABLE' }
      });

      // Mark reservation as inactive
      await tx.stockReservation.update({
        where: { id: reservation.id },
        data: { isActive: false }
      });

      // Cancel order if exists
      if (reservation.orderId) {
        await tx.order.update({
          where: { id: reservation.orderId },
          data: { status: 'CANCELLED' }
        });

        await tx.orderStatusLog.create({
          data: {
            orderId: reservation.orderId,
            status: 'CANCELLED',
            note: 'Pesanan otomatis dibatalkan (timeout pembayaran)',
            changedBy: 'system'
          }
        });
      }

      // Log inventory
      await tx.inventoryLog.create({
        data: {
          unitId: reservation.unitId,
          action: 'STATUS_CHANGE',
          fromStatus: 'RESERVED',
          toStatus: 'AVAILABLE',
          notes: 'Reservation expired',
          performedBy: 'system'
        }
      });
    });
  }
}
```

### 9.4 Frontend Stock Check

```typescript
// Di halaman produk, tampilkan real-time stok
async function checkStock(productId: string) {
  const units = await fetch(`/api/products/${productId}/units`);
  const available = units.filter(u => u.status === 'AVAILABLE');
  
  return {
    totalUnits: units.length,
    availableUnits: available.length,
    grades: available.map(u => ({
      grade: u.conditionGrade.code,
      battery: u.batteryHealth,
      price: u.sellingPrice
    }))
  };
}

// Di cart validation sebelum checkout
async function validateCart(cartItems: CartItem[]) {
  const response = await fetch('/api/cart/validate', {
    method: 'POST',
    body: JSON.stringify({ items: cartItems })
  });
  
  // Jika ada item yang sudah tidak tersedia
  if (!response.ok) {
    const errors = await response.json();
    // Tampilkan: "Produk X sudah tidak tersedia"
    // Atau: "Harga produk Y sudah berubah"
  }
}
```

---

## 10. Business Logic Pseudocode

### 10.1 Profit Calculation

```typescript
function calculateProfit(orderId: string) {
  const order = getOrderById(orderId);
  
  let totalRevenue = order.total;
  let totalCOGS = 0; // Cost of Goods Sold (HPP)
  
  for (const item of order.items) {
    const unit = getUnitById(item.unitId);
    totalCOGS += unit.purchasePrice;
  }
  
  const grossProfit = totalRevenue - totalCOGS;
  const margin = (grossProfit / totalRevenue) * 100;
  
  return {
    revenue: totalRevenue,
    cogs: totalCOGS,
    grossProfit,
    margin: `${margin.toFixed(1)}%`
  };
}
```

### 10.2 Auto-Grade Pricing

```typescript
function calculateSellingPrice(
  hpp: number,           // Harga beli dari supplier
  conditionScore: number, // Skor 1-100
  category: string        // Kategori produk
): number {
  // Base margin per kategori
  const margins: Record<string, number> = {
    'Laptop & Notebook': 0.35,      // 35% margin
    'Smartphone & Tablet': 0.30,    // 30% margin
    'Monitor & TV': 0.25,           // 25% margin
    'Networking & IT': 0.40,        // 40% margin
    'Peripheral & Aksesoris': 0.45  // 45% margin
  };
  
  // Grade modifier
  let gradeMultiplier = 1.0;
  if (conditionScore >= 95) gradeMultiplier = 1.0;      // Like New
  else if (conditionScore >= 85) gradeMultiplier = 0.9;  // Grade A
  else if (conditionScore >= 75) gradeMultiplier = 0.8;  // Grade B+
  else if (conditionScore >= 65) gradeMultiplier = 0.7;  // Grade B
  else if (conditionScore >= 50) gradeMultiplier = 0.5;  // Grade C
  
  const baseMargin = margins[category] || 0.30;
  const sellingPrice = hpp / (1 - baseMargin) * gradeMultiplier;
  
  // Bulatkan ke ribuan terdekat
  return Math.round(sellingPrice / 1000) * 1000;
}
```

### 10.3 Inventory Valuation

```typescript
function getInventoryValuation() {
  const units = getAllUnits({ status: 'AVAILABLE' });
  
  let totalCost = 0;   // Total HPP (modal)
  let totalValue = 0;  // Total harga jual
  
  for (const unit of units) {
    totalCost += unit.purchasePrice;
    totalValue += unit.sellingPrice;
  }
  
  return {
    totalUnits: units.length,
    totalCost,           // Modal yang tertanam
    totalValue,          // Potensi revenue
    potentialProfit: totalValue - totalCost,
    potentialMargin: ((totalValue - totalCost) / totalValue * 100).toFixed(1) + '%'
  };
}
```

---

## 11. Migration Strategy

### 11.1 Dari localStorage → PostgreSQL

```
Phase 1: Setup Database
────────────────────────
1. Buat PostgreSQL database (Supabase / Neon / Railway)
2. Run: npx prisma migrate dev --name init
3. Seed data: kategori, brand, grade, admin user

Phase 2: Migrate Data
──────────────────────
1. Export data dari localStorage (JSON)
2. Run migration script:
   - Import products → products table
   - Import users → users table
   - Import orders → orders table
   - Import blog posts → blog_posts table

Phase 3: Update Frontend
─────────────────────────
1. Ganti localStorage calls → API calls
2. Setup auth (NextAuth.js)
3. Test semua fitur

Phase 4: Deploy
───────────────
1. Setup Vercel / Railway untuk backend
2. Update Next.js ke SSR (bukan static export)
3. Setup CI/CD pipeline
```

### 11.2 Environment Variables

```env
# .env.local
DATABASE_URL="postgresql://user:pass@host:5432/beliseken"
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="https://beliseken.com"

# Payment
MIDTRANS_SERVER_KEY="SB-Mid-server-xxx"
MIDTRANS_CLIENT_KEY="SB-Mid-client-xxx"

# Shipping
RAJAONGKIR_API_KEY="your-rajaongkir-key"

# Storage
S3_BUCKET="beliseken-assets"
S3_REGION="ap-southeast-1"

# Redis (untuk stock reservation)
REDIS_URL="redis://default:pass@host:6379"
```

---

## Summary: Perbedaan Architectural Approach

```
┌────────────────────┬─────────────────────┬─────────────────────┐
│ Aspek              │ Saat Ini (localStorage)│ Target (PostgreSQL)│
├────────────────────┼─────────────────────┼─────────────────────┤
│ Data Storage       │ Browser localStorage│ PostgreSQL database │
│ Multi-device       │ ❌ Tidak sinkron    │ ✅ Sinkron          │
│ Multi-user         │ ❌ Per-user data    │ ✅ Shared database  │
│ Stock Management   │ ❌ Tidak ada        │ ✅ Real-time + lock │
│ Unique SKU/unit    │ ❌ Tidak ada        │ ✅ Per-unit tracking│
│ Supplier/Procurement│ ❌ Tidak ada       │ ✅ Full PO system   │
│ Profit Tracking    │ ❌ Tidak ada        │ ✅ HPP vs selling   │
│ Scalability        │ ❌ Max 50 items     │ ✅ Unlimited        │
│ SEO (SSR)          │ ⚠️ Static only     │ ✅ Full SSR         │
│ Admin Dashboard    │ ⚠️ Basic CRUD      │ ✅ Full analytics   │
│ API Security       │ ❌ Client-side      │ ✅ JWT + RBAC       │
└────────────────────┴─────────────────────┴─────────────────────┘
```

---

*Dokumen ini dirancang untuk BeliSeken.com v2.0 — Production-ready architecture.*
*Next step: Implement Prisma schema + API routes + auth system.*
