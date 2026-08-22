import { PrismaClient } from '../src/generated/prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...\n');

  // ══════════════════════════════════════════════════════════════
  // 1. CATEGORIES
  // ══════════════════════════════════════════════════════════════
  console.log('📁 Creating categories...');

  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'laptop-notebook' },
      update: {},
      create: {
        name: 'Laptop & Notebook',
        slug: 'laptop-notebook',
        icon: '💻',
        color: '#3b82f6',
        sortOrder: 1,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'smartphone-tablet' },
      update: {},
      create: {
        name: 'Smartphone & Tablet',
        slug: 'smartphone-tablet',
        icon: '📱',
        color: '#10b981',
        sortOrder: 2,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'monitor-tv' },
      update: {},
      create: {
        name: 'Monitor & TV',
        slug: 'monitor-tv',
        icon: '🖥️',
        color: '#8b5cf6',
        sortOrder: 3,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'networking-it' },
      update: {},
      create: {
        name: 'Networking & IT',
        slug: 'networking-it',
        icon: '🌐',
        color: '#f59e0b',
        sortOrder: 4,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'peripheral-aksesoris' },
      update: {},
      create: {
        name: 'Peripheral & Aksesoris',
        slug: 'peripheral-aksesoris',
        icon: '⌨️',
        color: '#ef4444',
        sortOrder: 5,
      },
    }),
  ]);

  // ══════════════════════════════════════════════════════════════
  // 2. SUB-CATEGORIES
  // ══════════════════════════════════════════════════════════════
  console.log('📂 Creating sub-categories...');

  const subCategories = await Promise.all([
    // Laptop subcategories
    prisma.subCategory.upsert({
      where: { slug: 'ultrabook' },
      update: {},
      create: { name: 'Ultrabook', slug: 'ultrabook', categoryId: categories[0].id, sortOrder: 1 },
    }),
    prisma.subCategory.upsert({
      where: { slug: 'laptop-gaming' },
      update: {},
      create: { name: 'Laptop Gaming', slug: 'laptop-gaming', categoryId: categories[0].id, sortOrder: 2 },
    }),
    prisma.subCategory.upsert({
      where: { slug: 'laptop-kantor' },
      update: {},
      create: { name: 'Laptop Kantor', slug: 'laptop-kantor', categoryId: categories[0].id, sortOrder: 3 },
    }),
    // Smartphone subcategories
    prisma.subCategory.upsert({
      where: { slug: 'smartphone' },
      update: {},
      create: { name: 'Smartphone', slug: 'smartphone', categoryId: categories[1].id, sortOrder: 1 },
    }),
    prisma.subCategory.upsert({
      where: { slug: 'tablet' },
      update: {},
      create: { name: 'Tablet', slug: 'tablet', categoryId: categories[1].id, sortOrder: 2 },
    }),
    // Monitor subcategories
    prisma.subCategory.upsert({
      where: { slug: 'monitor' },
      update: {},
      create: { name: 'Monitor', slug: 'monitor', categoryId: categories[2].id, sortOrder: 1 },
    }),
    prisma.subCategory.upsert({
      where: { slug: 'monitor-gaming' },
      update: {},
      create: { name: 'Monitor Gaming', slug: 'monitor-gaming', categoryId: categories[2].id, sortOrder: 2 },
    }),
    prisma.subCategory.upsert({
      where: { slug: 'tv' },
      update: {},
      create: { name: 'TV', slug: 'tv', categoryId: categories[2].id, sortOrder: 3 },
    }),
    // Networking subcategories
    prisma.subCategory.upsert({
      where: { slug: 'router' },
      update: {},
      create: { name: 'Router', slug: 'router', categoryId: categories[3].id, sortOrder: 1 },
    }),
    prisma.subCategory.upsert({
      where: { slug: 'access-point' },
      update: {},
      create: { name: 'Access Point', slug: 'access-point', categoryId: categories[3].id, sortOrder: 2 },
    }),
    prisma.subCategory.upsert({
      where: { slug: 'switch' },
      update: {},
      create: { name: 'Switch', slug: 'switch', categoryId: categories[3].id, sortOrder: 3 },
    }),
    // Peripheral subcategories
    prisma.subCategory.upsert({
      where: { slug: 'mouse' },
      update: {},
      create: { name: 'Mouse', slug: 'mouse', categoryId: categories[4].id, sortOrder: 1 },
    }),
    prisma.subCategory.upsert({
      where: { slug: 'keyboard' },
      update: {},
      create: { name: 'Keyboard', slug: 'keyboard', categoryId: categories[4].id, sortOrder: 2 },
    }),
    prisma.subCategory.upsert({
      where: { slug: 'headphone' },
      update: {},
      create: { name: 'Headphone', slug: 'headphone', categoryId: categories[4].id, sortOrder: 3 },
    }),
  ]);

  // ══════════════════════════════════════════════════════════════
  // 3. BRANDS
  // ══════════════════════════════════════════════════════════════
  console.log('🏷️ Creating brands...');

  const brands = await Promise.all([
    prisma.brand.upsert({ where: { slug: 'apple' }, update: {}, create: { name: 'Apple', slug: 'apple' } }),
    prisma.brand.upsert({ where: { slug: 'lenovo' }, update: {}, create: { name: 'Lenovo', slug: 'lenovo' } }),
    prisma.brand.upsert({ where: { slug: 'asus' }, update: {}, create: { name: 'ASUS', slug: 'asus' } }),
    prisma.brand.upsert({ where: { slug: 'hp' }, update: {}, create: { name: 'HP', slug: 'hp' } }),
    prisma.brand.upsert({ where: { slug: 'dell' }, update: {}, create: { name: 'Dell', slug: 'dell' } }),
    prisma.brand.upsert({ where: { slug: 'samsung' }, update: {}, create: { name: 'Samsung', slug: 'samsung' } }),
    prisma.brand.upsert({ where: { slug: 'xiaomi' }, update: {}, create: { name: 'Xiaomi', slug: 'xiaomi' } }),
    prisma.brand.upsert({ where: { slug: 'lg' }, update: {}, create: { name: 'LG', slug: 'lg' } }),
    prisma.brand.upsert({ where: { slug: 'mikrotik' }, update: {}, create: { name: 'MikroTik', slug: 'mikrotik' } }),
    prisma.brand.upsert({ where: { slug: 'tp-link' }, update: {}, create: { name: 'TP-Link', slug: 'tp-link' } }),
    prisma.brand.upsert({ where: { slug: 'ubiquiti' }, update: {}, create: { name: 'Ubiquiti', slug: 'ubiquiti' } }),
    prisma.brand.upsert({ where: { slug: 'logitech' }, update: {}, create: { name: 'Logitech', slug: 'logitech' } }),
    prisma.brand.upsert({ where: { slug: 'razer' }, update: {}, create: { name: 'Razer', slug: 'razer' } }),
    prisma.brand.upsert({ where: { slug: 'keychron' }, update: {}, create: { name: 'Keychron', slug: 'keychron' } }),
    prisma.brand.upsert({ where: { slug: 'hyperx' }, update: {}, create: { name: 'HyperX', slug: 'hyperx' } }),
  ]);

  // ══════════════════════════════════════════════════════════════
  // 4. CONDITION GRADES
  // ══════════════════════════════════════════════════════════════
  console.log('⭐ Creating condition grades...');

  const grades = await Promise.all([
    prisma.conditionGrade.upsert({
      where: { code: 'A+' },
      update: {},
      create: {
        code: 'A+',
        name: 'Like New',
        description: 'Seperti baru, tidak ada lecet/baret, baterai >90%, semua fungsi normal sempurna',
        minScore: 95,
        maxScore: 100,
        priceModifier: 1.0,
        sortOrder: 1,
      },
    }),
    prisma.conditionGrade.upsert({
      where: { code: 'A' },
      update: {},
      create: {
        code: 'A',
        name: 'Mulus',
        description: 'Sangat mulus, lecet sangat minor (tidak terlihat jelas), baterai >80%, semua fungsi normal',
        minScore: 85,
        maxScore: 94,
        priceModifier: 0.9,
        sortOrder: 2,
      },
    }),
    prisma.conditionGrade.upsert({
      where: { code: 'B+' },
      update: {},
      create: {
        code: 'B+',
        name: 'Bagus',
        description: 'Ada lecet pemakaian wajar, baterai >70%, semua fungsi normal',
        minScore: 75,
        maxScore: 84,
        priceModifier: 0.8,
        sortOrder: 3,
      },
    }),
    prisma.conditionGrade.upsert({
      where: { code: 'B' },
      update: {},
      create: {
        code: 'B',
        name: 'Biasa',
        description: 'Lecet terlihat, baterai >60%, fungsi normal',
        minScore: 65,
        maxScore: 74,
        priceModifier: 0.7,
        sortOrder: 4,
      },
    }),
    prisma.conditionGrade.upsert({
      where: { code: 'C' },
      update: {},
      create: {
        code: 'C',
        name: 'Minus',
        description: 'Lecet/baret terlihat, ada minor issue (misal: speaker kiri mati), baterai >40%',
        minScore: 50,
        maxScore: 64,
        priceModifier: 0.5,
        sortOrder: 5,
      },
    }),
    prisma.conditionGrade.upsert({
      where: { code: 'D' },
      update: {},
      create: {
        code: 'D',
        name: 'Rusak Ringan',
        description: 'Fungsi ada yang tidak jalan, masih bisa diperbaiki',
        minScore: 30,
        maxScore: 49,
        priceModifier: 0.3,
        sortOrder: 6,
      },
    }),
  ]);

  // ══════════════════════════════════════════════════════════════
  // 5. ADMIN USER
  // ══════════════════════════════════════════════════════════════
  console.log('👤 Creating admin user...');

  const hashedPassword = await bcrypt.hash('123456', 10);
  
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@beliseken.com' },
    update: {},
    create: {
      email: 'admin@beliseken.com',
      password: hashedPassword,
      name: 'Admin BeliSeken',
      phone: '085101256123',
      role: 'SUPER_ADMIN',
      isActive: true,
    },
  });

  // ══════════════════════════════════════════════════════════════
  // 6. SAMPLE PRODUCTS (10 items from Laptop category)
  // ══════════════════════════════════════════════════════════════
  console.log('📦 Creating sample products...');

  const laptopCategory = categories[0];
  const ultrabookSubcat = subCategories[0];
  const laptopGamingSubcat = subCategories[1];
  const laptopKantorSubcat = subCategories[2];
  const appleBrand = brands[0];
  const lenovoBrand = brands[1];
  const asusBrand = brands[2];
  const hpBrand = brands[3];
  const dellBrand = brands[4];
  const gradeA = grades[1];
  const gradeAPlus = grades[0];
  const gradeBPlus = grades[2];

  const sampleProducts = [
    {
      name: 'MacBook Air M1 2020',
      slug: 'macbook-air-m1-2020',
      sku: 'LAP-APL-MBA-M1',
      description: 'MacBook Air M1 2020 kondisi like new. Sangat cocok untuk kerja dan kuliah.',
      categoryId: laptopCategory.id,
      subcategoryId: ultrabookSubcat.id,
      brandId: appleBrand.id,
      basePrice: 4500000,
      sellingPrice: 6500000,
      discount: 50,
      weight: 1290,
      dimensions: '30.41 x 21.24 x 1.61 cm',
      badge: 'HOT DEAL',
      isFeatured: true,
    },
    {
      name: 'ThinkPad X1 Carbon Gen 9',
      slug: 'thinkpad-x1-carbon-gen9',
      sku: 'LAP-LNV-X1C-G9',
      description: 'Lenovo ThinkPad X1 Carbon Gen 9 untuk profesional IT.',
      categoryId: laptopCategory.id,
      subcategoryId: ultrabookSubcat.id,
      brandId: lenovoBrand.id,
      basePrice: 5500000,
      sellingPrice: 8200000,
      discount: 47,
      weight: 1090,
      dimensions: '32.3 x 21.7 x 1.49 cm',
      badge: 'BEST SELLER',
      isFeatured: true,
    },
    {
      name: 'ASUS ROG Strix G14',
      slug: 'asus-rog-strix-g14',
      sku: 'LAP-ASU-ROG-G14',
      description: 'Laptop gaming ASUS ROG Strix G14 performa tinggi.',
      categoryId: laptopCategory.id,
      subcategoryId: laptopGamingSubcat.id,
      brandId: asusBrand.id,
      basePrice: 6800000,
      sellingPrice: 9800000,
      discount: 46,
      weight: 1700,
      dimensions: '32.4 x 22.2 x 1.99 cm',
      badge: 'HOT DEAL',
      isFeatured: true,
    },
    {
      name: 'HP ProBook 440 G8',
      slug: 'hp-probook-440-g8',
      sku: 'LAP-HP-PB440-G8',
      description: 'Laptop bisnis HP ProBook 440 G8.',
      categoryId: laptopCategory.id,
      subcategoryId: laptopKantorSubcat.id,
      brandId: hpBrand.id,
      basePrice: 2800000,
      sellingPrice: 4200000,
      discount: 51,
      weight: 1380,
      dimensions: '32.4 x 22.5 x 1.90 cm',
    },
    {
      name: 'Dell Latitude 5420',
      slug: 'dell-latitude-5420',
      sku: 'LAP-DEL-LAT-5420',
      description: 'Dell Latitude 5420 untuk profesional.',
      categoryId: laptopCategory.id,
      subcategoryId: laptopKantorSubcat.id,
      brandId: dellBrand.id,
      basePrice: 3500000,
      sellingPrice: 5500000,
      discount: 51,
      weight: 1410,
      dimensions: '32.1 x 21.3 x 1.84 cm',
      badge: 'BEST SELLER',
    },
  ];

  const createdProducts = [];
  for (const productData of sampleProducts) {
    const product = await prisma.product.upsert({
      where: { slug: productData.slug },
      update: {},
      create: {
        ...productData,
        isActive: true,
        publishedAt: new Date(),
      },
    });
    createdProducts.push(product);
  }

  // ══════════════════════════════════════════════════════════════
  // 7. SAMPLE PRODUCT UNITS (2-3 units per product)
  // ══════════════════════════════════════════════════════════════
  console.log('📦 Creating sample product units...');

  for (const product of createdProducts) {
    // Create 2-3 units per product
    const units = [
      {
        unitSku: `${product.sku}-001`,
        conditionScore: 95,
        conditionNotes: 'Kondisi sempurna',
        batteryHealth: 95,
        purchasePrice: product.basePrice,
        sellingPrice: product.sellingPrice,
        status: 'AVAILABLE',
        conditionGradeId: gradeAPlus.id,
      },
      {
        unitSku: `${product.sku}-002`,
        conditionScore: 88,
        conditionNotes: 'Ada lecet minor di bodi',
        batteryHealth: 85,
        purchasePrice: product.basePrice,
        sellingPrice: Math.round(product.sellingPrice * 0.9),
        status: 'AVAILABLE',
        conditionGradeId: gradeA.id,
      },
      {
        unitSku: `${product.sku}-003`,
        conditionScore: 78,
        conditionNotes: 'Lecet pemakaian normal',
        batteryHealth: 75,
        purchasePrice: product.basePrice,
        sellingPrice: Math.round(product.sellingPrice * 0.8),
        status: 'AVAILABLE',
        conditionGradeId: gradeBPlus.id,
      },
    ];

    for (const unitData of units) {
      await prisma.productUnit.upsert({
        where: { unitSku: unitData.unitSku },
        update: {},
        create: {
          productId: product.id,
          ...unitData,
        },
      });
    }
  }

  // ══════════════════════════════════════════════════════════════
  // 8. SAMPLE BANNERS
  // ══════════════════════════════════════════════════════════════
  console.log('🖼️ Creating sample banners...');

  await prisma.banner.upsert({
    where: { id: 'banner-1' },
    update: {},
    create: {
      id: 'banner-1',
      type: 'HERO',
      title: 'Flash Sale Elektronik Bekas',
      subtitle: 'Diskon s/d 50% untuk produk pilihan',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      ctaText: 'Lihat Semua',
      ctaLink: '/products',
      isActive: true,
      sortOrder: 1,
    },
  });

  await prisma.banner.upsert({
    where: { id: 'banner-promo-1' },
    update: {},
    create: {
      id: 'banner-promo-1',
      type: 'PROMO_CARD',
      title: 'Laptop Gaming',
      subtitle: 'Mulai 3.5jt',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      ctaText: 'Belanja',
      ctaLink: '/category/laptop-notebook',
      isActive: true,
      sortOrder: 1,
    },
  });

  console.log('\n✅ Seeding completed!');
  console.log('─────────────────────────────────────');
  console.log('Admin: admin@beliseken.com / 123456');
  console.log(`Categories: ${categories.length}`);
  console.log(`SubCategories: ${subCategories.length}`);
  console.log(`Brands: ${brands.length}`);
  console.log(`Grades: ${grades.length}`);
  console.log(`Products: ${createdProducts.length}`);
  console.log(`Units: ${createdProducts.length * 3}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
