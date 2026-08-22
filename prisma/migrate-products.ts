import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ══════════════════════════════════════════════════════════════
// All 50 products from the existing data
// ══════════════════════════════════════════════════════════════

interface ProductData {
  name: string;
  slug: string;
  sku: string;
  category: string;
  subcategory: string;
  brand: string;
  sellingPrice: number;
  originalPrice: number;
  discount: number;
  condition: string;
  badge?: string;
  isFeatured?: boolean;
  description: string;
  specs: string[];
  weight: number;
  dimensions: string;
}

const allProducts: ProductData[] = [
  // ═══ LAPTOP & NOTEBOOK (10) ═══
  {
    name: 'MacBook Air M1 2020', slug: 'macbook-air-m1-2020', sku: 'LAP-APL-MBA-M1',
    category: 'Laptop & Notebook', subcategory: 'Ultrabook', brand: 'Apple',
    sellingPrice: 6500000, originalPrice: 12999000, discount: 50, condition: 'Like New',
    badge: 'HOT DEAL', isFeatured: true,
    description: 'MacBook Air M1 2020 kondisi like new. Sangat cocok untuk kerja dan kuliah. Baterai masih awet, performa responsif.',
    specs: ['8GB RAM', '256GB SSD', 'M1 Chip', '13.3 inch Retina', 'Baterai 95%'],
    weight: 1290, dimensions: '30.41 x 21.24 x 1.61 cm',
  },
  {
    name: 'ThinkPad X1 Carbon Gen 9', slug: 'thinkpad-x1-carbon-gen9', sku: 'LAP-LNV-X1C-G9',
    category: 'Laptop & Notebook', subcategory: 'Ultrabook', brand: 'Lenovo',
    sellingPrice: 8200000, originalPrice: 15500000, discount: 47, condition: 'Grade A',
    badge: 'BEST SELLER',
    description: 'Lenovo ThinkPad X1 Carbon Gen 9 untuk profesional IT. Ringan, performa tinggi, keyboard legendaris.',
    specs: ['i5-1135G7', '16GB RAM', '512GB SSD', '14 inch FHD', 'Baterai 90%'],
    weight: 1090, dimensions: '32.3 x 21.7 x 1.49 cm',
  },
  {
    name: 'ASUS ROG Strix G14', slug: 'asus-rog-strix-g14', sku: 'LAP-ASU-ROG-G14',
    category: 'Laptop & Notebook', subcategory: 'Laptop Gaming', brand: 'ASUS',
    sellingPrice: 9800000, originalPrice: 17999000, discount: 46, condition: 'Grade A',
    badge: 'HOT DEAL', isFeatured: true,
    description: 'Laptop gaming ASUS ROG Strix G14 performa tinggi. Cocok untuk gaming dan editing video.',
    specs: ['Ryzen 9 5900HX', '16GB RAM', 'RTX 3060', '512GB SSD', '14 inch 144Hz'],
    weight: 1700, dimensions: '32.4 x 22.2 x 1.99 cm',
  },
  {
    name: 'HP ProBook 440 G8', slug: 'hp-probook-440-g8', sku: 'LAP-HP-PB440',
    category: 'Laptop & Notebook', subcategory: 'Laptop Kantor', brand: 'HP',
    sellingPrice: 4200000, originalPrice: 8500000, discount: 51, condition: 'Grade A',
    description: 'Laptop bisnis HP ProBook 440 G8. Cocok untuk UMKM dan pekerja kantoran.',
    specs: ['i5-1135G7', '8GB RAM', '256GB SSD', '14 inch FHD', 'Baterai 85%'],
    weight: 1380, dimensions: '32.4 x 22.5 x 1.90 cm',
  },
  {
    name: 'Dell Latitude 5420', slug: 'dell-latitude-5420', sku: 'LAP-DEL-LAT-5420',
    category: 'Laptop & Notebook', subcategory: 'Laptop Kantor', brand: 'Dell',
    sellingPrice: 5500000, originalPrice: 11200000, discount: 51, condition: 'Grade A',
    badge: 'BEST SELLER',
    description: 'Dell Latitude 5420 untuk profesional. Layar FHD, performa handal, build quality premium.',
    specs: ['i5-1145G7', '8GB RAM', '256GB SSD', '14 inch FHD', 'Baterai 88%'],
    weight: 1410, dimensions: '32.1 x 21.3 x 1.84 cm',
  },
  {
    name: 'Lenovo IdeaPad Slim 3', slug: 'lenovo-ideapad-slim-3', sku: 'LAP-LNV-IS3',
    category: 'Laptop & Notebook', subcategory: 'Ultrabook', brand: 'Lenovo',
    sellingPrice: 3800000, originalPrice: 7499000, discount: 49, condition: 'Grade B+',
    description: 'Lenovo IdeaPad Slim 3 ringan dan tipis. Cocok untuk pelajar dan pekerja ringan.',
    specs: ['i3-1115G4', '4GB RAM', '256GB SSD', '14 inch HD', 'Baterai 80%'],
    weight: 1410, dimensions: '32.7 x 24.1 x 1.99 cm',
  },
  {
    name: 'MacBook Pro 14 M1 Pro', slug: 'macbook-pro-14-m1-pro', sku: 'LAP-APL-MBP14',
    category: 'Laptop & Notebook', subcategory: 'Ultrabook', brand: 'Apple',
    sellingPrice: 16500000, originalPrice: 28999000, discount: 43, condition: 'Like New',
    badge: 'HOT DEAL', isFeatured: true,
    description: 'MacBook Pro 14 M1 Pro untuk kreator konten. Layar Liquid Retina XDR, performa monster.',
    specs: ['M1 Pro', '16GB RAM', '512GB SSD', '14.2 inch Liquid Retina XDR', 'Baterai 92%'],
    weight: 1600, dimensions: '31.26 x 22.12 x 1.55 cm',
  },
  {
    name: 'ASUS VivoBook 14', slug: 'asus-vivobook-14', sku: 'LAP-ASU-VB14',
    category: 'Laptop & Notebook', subcategory: 'Ultrabook', brand: 'ASUS',
    sellingPrice: 3500000, originalPrice: 6999000, discount: 50, condition: 'Grade B+',
    description: 'ASUS VivoBook 14 untuk sehari-hari. Ringan, mudah dibawa ke mana-mana.',
    specs: ['i5-1035G1', '8GB RAM', '256GB SSD', '14 inch FHD', 'Baterai 78%'],
    weight: 1400, dimensions: '32.5 x 21.6 x 1.90 cm',
  },
  {
    name: 'Acer Aspire 5', slug: 'acer-aspire-5', sku: 'LAP-ACE-A5',
    category: 'Laptop & Notebook', subcategory: 'Laptop Kantor', brand: 'Acer',
    sellingPrice: 3900000, originalPrice: 7800000, discount: 50, condition: 'Grade A',
    description: 'Acer Aspire 5 performa solid untuk multitasking. Cocok untuk kantor dan pelajar.',
    specs: ['Ryzen 5 3500U', '8GB RAM', '256GB SSD', '15.6 inch FHD', 'Baterai 82%'],
    weight: 1740, dimensions: '36.3 x 25.1 x 1.80 cm',
  },
  {
    name: 'Lenovo ThinkPad T480', slug: 'lenovo-thinkpad-t480', sku: 'LAP-LNV-T480',
    category: 'Laptop & Notebook', subcategory: 'Laptop Kantor', brand: 'Lenovo',
    sellingPrice: 4500000, originalPrice: 9000000, discount: 50, condition: 'Grade A',
    badge: 'BEST SELLER',
    description: 'ThinkPad T480 legendary durability. Keyboard terbaik, build quality militer.',
    specs: ['i5-8250U', '8GB RAM', '256GB SSD', '14 inch FHD', 'Dual Battery'],
    weight: 1650, dimensions: '33.6 x 23.2 x 1.99 cm',
  },

  // ═══ SMARTPHONE & TABLET (10) ═══
  {
    name: 'iPhone 13 Pro 128GB', slug: 'iphone-13-pro-128gb', sku: 'HP-APL-IP13P',
    category: 'Smartphone & Tablet', subcategory: 'Smartphone', brand: 'Apple',
    sellingPrice: 4800000, originalPrice: 8499000, discount: 43, condition: 'Grade A',
    badge: 'BEST SELLER', isFeatured: true,
    description: 'iPhone 13 Pro 128GB kondisi Grade A. ProMotion 120Hz, performa A15 Bionic masih kencang.',
    specs: ['128GB', 'A15 Bionic', 'ProMotion 120Hz', 'Kondisi 93%', 'Baterai 89%'],
    weight: 203, dimensions: '14.67 x 7.15 x 0.77 cm',
  },
  {
    name: 'Samsung Galaxy S22 Ultra', slug: 'samsung-galaxy-s22-ultra', sku: 'HP-SAM-S22U',
    category: 'Smartphone & Tablet', subcategory: 'Smartphone', brand: 'Samsung',
    sellingPrice: 3200000, originalPrice: 5999000, discount: 47, condition: 'Grade B+',
    description: 'Samsung Galaxy S22 Ultra dengan S Pen. Kondisi 88%, masih sangat layak pakai.',
    specs: ['256GB', 'Snapdragon 8 Gen 1', 'S Pen', 'Kondisi 88%', 'Layar AMOLED'],
    weight: 228, dimensions: '16.33 x 7.79 x 0.89 cm',
  },
  {
    name: 'iPhone 14 128GB', slug: 'iphone-14-128gb', sku: 'HP-APL-IP14',
    category: 'Smartphone & Tablet', subcategory: 'Smartphone', brand: 'Apple',
    sellingPrice: 5200000, originalPrice: 9999000, discount: 48, condition: 'Grade A',
    badge: 'NEW',
    description: 'iPhone 14 128GB kondisi Grade A. Layar OLED, performa A15, kamera ganda.',
    specs: ['128GB', 'A15 Bionic', '6.1 inch OLED', 'Kondisi 95%', 'Baterai 91%'],
    weight: 172, dimensions: '14.67 x 7.15 x 0.78 cm',
  },
  {
    name: 'Samsung Galaxy A54', slug: 'samsung-galaxy-a54', sku: 'HP-SAM-A54',
    category: 'Smartphone & Tablet', subcategory: 'Smartphone', brand: 'Samsung',
    sellingPrice: 2200000, originalPrice: 4499000, discount: 51, condition: 'Grade A',
    description: 'Samsung Galaxy A54 mid-range premium. Layar Super AMOLED, tahan air IP67.',
    specs: ['128GB', 'Exynos 1380', '6.4 inch AMOLED 120Hz', 'IP67', 'Baterai 90%'],
    weight: 202, dimensions: '15.82 x 7.67 x 0.82 cm',
  },
  {
    name: 'iPad Air M1 64GB', slug: 'ipad-air-m1-64gb', sku: 'HP-APL-IPAD-AIR',
    category: 'Smartphone & Tablet', subcategory: 'Tablet', brand: 'Apple',
    sellingPrice: 5800000, originalPrice: 9499000, discount: 39, condition: 'Like New',
    badge: 'BEST SELLER',
    description: 'iPad Air M1 untuk produktivitas dan kreativitas. Chip M1 performa desktop.',
    specs: ['64GB', 'M1 Chip', '10.9 inch Liquid Retina', 'Apple Pencil 2', 'Baterai 95%'],
    weight: 461, dimensions: '24.76 x 17.85 x 0.61 cm',
  },
  {
    name: 'Samsung Galaxy Tab S8', slug: 'samsung-galaxy-tab-s8', sku: 'HP-SAM-TABS8',
    category: 'Smartphone & Tablet', subcategory: 'Tablet', brand: 'Samsung',
    sellingPrice: 3200000, originalPrice: 5999000, discount: 47, condition: 'Grade A',
    description: 'Samsung Galaxy Tab S8 untuk multitasking. S Pen included, layar 120Hz.',
    specs: ['128GB', 'Snapdragon 8 Gen 1', '11 inch LTPS 120Hz', 'S Pen', 'Baterai 88%'],
    weight: 502, dimensions: '25.38 x 16.53 x 0.63 cm',
  },
  {
    name: 'Xiaomi Redmi Note 12', slug: 'xiaomi-redmi-note-12', sku: 'HP-XIA-RN12',
    category: 'Smartphone & Tablet', subcategory: 'Smartphone', brand: 'Xiaomi',
    sellingPrice: 1200000, originalPrice: 2499000, discount: 52, condition: 'Grade A',
    badge: 'HOT DEAL',
    description: 'Xiaomi Redmi Note 12 value for money. Layar AMOLED 120Hz, kamera 50MP.',
    specs: ['128GB', 'Snapdragon 685', '6.67 inch AMOLED 120Hz', '50MP Camera', 'Baterai 87%'],
    weight: 183, dimensions: '16.59 x 7.62 x 0.80 cm',
  },
  {
    name: 'iPhone 12 Mini 64GB', slug: 'iphone-12-mini-64gb', sku: 'HP-APL-IP12M',
    category: 'Smartphone & Tablet', subcategory: 'Smartphone', brand: 'Apple',
    sellingPrice: 2800000, originalPrice: 5999000, discount: 53, condition: 'Grade B+',
    description: 'iPhone 12 Mini compact flagship. Cocok untuk yang suka ukuran kecil tapi powerful.',
    specs: ['64GB', 'A14 Bionic', '5.4 inch OLED', 'Kondisi 85%', 'Baterai 82%'],
    weight: 135, dimensions: '13.15 x 6.42 x 0.74 cm',
  },
  {
    name: 'Samsung Galaxy Tab A8', slug: 'samsung-galaxy-tab-a8', sku: 'HP-SAM-TABA8',
    category: 'Smartphone & Tablet', subcategory: 'Tablet', brand: 'Samsung',
    sellingPrice: 1800000, originalPrice: 3499000, discount: 49, condition: 'Grade A',
    description: 'Samsung Galaxy Tab A8 untuk hiburan dan belajar. Layar 10.5 inch, speaker quad.',
    specs: ['64GB', 'Unisoc T618', '10.5 inch TFT', 'Speaker Quad', 'Baterai 85%'],
    weight: 508, dimensions: '24.68 x 16.13 x 0.69 cm',
  },
  {
    name: 'Realme GT Neo 3', slug: 'realme-gt-neo-3', sku: 'HP-REAL-GTN3',
    category: 'Smartphone & Tablet', subcategory: 'Smartphone', brand: 'Realme',
    sellingPrice: 1800000, originalPrice: 3999000, discount: 55, condition: 'Grade A',
    badge: 'NEW',
    description: 'Realme GT Neo 3 performa gaming. Charging 150W, layar AMOLED 120Hz.',
    specs: ['128GB', 'Dimensity 8100', '6.7 inch AMOLED 120Hz', '150W Charging', 'Baterai 90%'],
    weight: 194, dimensions: '16.33 x 7.56 x 0.82 cm',
  },

  // ═══ MONITOR & TV (10) ═══
  {
    name: 'Dell UltraSharp U2720Q 4K', slug: 'dell-u2720q-4k', sku: 'MON-DEL-U27',
    category: 'Monitor & TV', subcategory: 'Monitor', brand: 'Dell',
    sellingPrice: 2900000, originalPrice: 5200000, discount: 44, condition: 'Grade A',
    badge: 'NEW', isFeatured: true,
    description: 'Monitor 4K 27 inch untuk desain dan editing. USB-C 90W charging, warna akurat.',
    specs: ['27 inch 4K IPS', 'USB-C 90W', 'HDR 400', '100% sRGB', '60Hz'],
    weight: 6600, dimensions: '61.1 x 22.0 x 51.5 cm',
  },
  {
    name: 'LG 27GN800-B UltraGear', slug: 'lg-27gn800b-ultragear', sku: 'MON-LG-UG27',
    category: 'Monitor & TV', subcategory: 'Monitor Gaming', brand: 'LG',
    sellingPrice: 1800000, originalPrice: 3499000, discount: 49, condition: 'Grade A',
    badge: 'BEST SELLER',
    description: 'Monitor gaming LG UltraGear 27 inch. Nano IPS, 144Hz, 1ms response time.',
    specs: ['27 inch QHD Nano IPS', '144Hz', '1ms GTG', 'HDR 10', 'G-Sync Compatible'],
    weight: 5800, dimensions: '61.3 x 23.7 x 45.8 cm',
  },
  {
    name: 'Samsung LU32J390 4K 32 inch', slug: 'samsung-lu32j390-4k-32', sku: 'MON-SAM-U32',
    category: 'Monitor & TV', subcategory: 'Monitor', brand: 'Samsung',
    sellingPrice: 1500000, originalPrice: 2999000, discount: 50, condition: 'Grade A',
    description: 'Monitor Samsung 4K 32 inch untuk produktivitas. Ukuran besar, resolusi tajam.',
    specs: ['32 inch 4K UHD', 'IPS Panel', '60Hz', 'HDMI + DisplayPort', 'AMD FreeSync'],
    weight: 7500, dimensions: '73.0 x 22.0 x 59.7 cm',
  },
  {
    name: 'LG 55UN7300 55 inch Smart TV', slug: 'lg-55un7300-55-smart-tv', sku: 'TV-LG-55U',
    category: 'Monitor & TV', subcategory: 'TV', brand: 'LG',
    sellingPrice: 2800000, originalPrice: 5499000, discount: 49, condition: 'Grade A',
    badge: 'HOT DEAL',
    description: 'Smart TV LG 55 inch 4K UHD. webOS, ThinQ AI, HDR10 Pro.',
    specs: ['55 inch 4K UHD', 'webOS', 'ThinQ AI', 'HDR10 Pro', '3x HDMI'],
    weight: 14400, dimensions: '123.5 x 71.9 x 25.9 cm',
  },
  {
    name: 'BenQ GW2480 24 inch', slug: 'benq-gw2480-24', sku: 'MON-BEN-GW24',
    category: 'Monitor & TV', subcategory: 'Monitor', brand: 'BenQ',
    sellingPrice: 900000, originalPrice: 1799000, discount: 50, condition: 'Grade A',
    badge: 'BEST SELLER',
    description: 'Monitor BenQ 24 inch eye-care. Low Blue Light, Flicker-Free, IPS panel.',
    specs: ['24 inch FHD IPS', '60Hz', 'Low Blue Light', 'Flicker-Free', 'Built-in Speakers'],
    weight: 3700, dimensions: '54.0 x 22.5 x 40.2 cm',
  },
  {
    name: 'Asus ProArt PA278QV 27 inch', slug: 'asus-proart-pa278qv-27', sku: 'MON-ASU-PA27',
    category: 'Monitor & TV', subcategory: 'Monitor', brand: 'ASUS',
    sellingPrice: 2200000, originalPrice: 4299000, discount: 49, condition: 'Grade A',
    description: 'Monitor ASUS ProArt untuk desainer. Warna akurat Calman Verified, 2K QHD.',
    specs: ['27 inch QHD IPS', '100% sRGB', 'Calman Verified', 'USB-C', '65W PD'],
    weight: 7120, dimensions: '61.4 x 23.0 x 50.5 cm',
  },
  {
    name: 'Hisense 43A6500 43 inch Smart TV', slug: 'hisense-43a6500-43-smart-tv', sku: 'TV-HIS-43A',
    category: 'Monitor & TV', subcategory: 'TV', brand: 'Hisense',
    sellingPrice: 1500000, originalPrice: 2999000, discount: 50, condition: 'Grade A',
    description: 'Smart TV Hisense 43 inch. VIDAA OS, HDR, DTS Virtual surround.',
    specs: ['43 inch FHD', 'VIDAA OS', 'HDR', 'DTS Virtual', '2x HDMI'],
    weight: 7800, dimensions: '96.5 x 56.2 x 18.5 cm',
  },
  {
    name: 'Samsung Odyssey G5 27 inch', slug: 'samsung-odyssey-g5-27', sku: 'MON-SAM-OG5',
    category: 'Monitor & TV', subcategory: 'Monitor Gaming', brand: 'Samsung',
    sellingPrice: 1900000, originalPrice: 3799000, discount: 50, condition: 'Grade A',
    badge: 'HOT DEAL',
    description: 'Monitor gaming Samsung Odyssey G5. Curved 1000R, 165Hz, 1ms.',
    specs: ['27 inch QHD VA', '165Hz', '1ms', '1000R Curved', 'FreeSync Premium'],
    weight: 5500, dimensions: '61.7 x 24.4 x 47.3 cm',
  },
  {
    name: 'Philips 242M1 24 inch', slug: 'philips-242m1-24', sku: 'MON-PHI-242',
    category: 'Monitor & TV', subcategory: 'Monitor Gaming', brand: 'Philips',
    sellingPrice: 1200000, originalPrice: 2499000, discount: 52, condition: 'Grade A',
    description: 'Monitor Philips 24 inch gaming. 144Hz, 1ms MPRT, Adaptive Sync.',
    specs: ['24 inch FHD VA', '144Hz', '1ms MPRT', 'Adaptive Sync', 'LowBlue Mode'],
    weight: 4200, dimensions: '55.5 x 22.0 x 40.2 cm',
  },
  {
    name: 'Coocaa 32S7G 32 inch Smart TV', slug: 'coocaa-32s7g-32-smart-tv', sku: 'TV-COO-32S',
    category: 'Monitor & TV', subcategory: 'TV', brand: 'Coocaa',
    sellingPrice: 1100000, originalPrice: 2199000, discount: 50, condition: 'Grade A',
    badge: 'NEW',
    description: 'Smart TV Coocaa 32 inch Android TV. Google Assistant, Chromecast built-in.',
    specs: ['32 inch HD', 'Android TV', 'Google Assistant', 'Chromecast', '2x HDMI'],
    weight: 4500, dimensions: '73.0 x 45.6 x 18.0 cm',
  },

  // ═══ NETWORKING & IT (10) ═══
  {
    name: 'MikroTik RB750Gr3', slug: 'mikrotik-rb750gr3', sku: 'NET-MIK-RB750',
    category: 'Networking & IT', subcategory: 'Router', brand: 'MikroTik',
    sellingPrice: 380000, originalPrice: 750000, discount: 49, condition: 'Grade A',
    badge: 'NEW', isFeatured: true,
    description: 'Router MikroTik gigabit untuk UMKM. RouterOS L4, performa stabil untuk jaringan kantor.',
    specs: ['Gigabit Ethernet', '750MHz CPU', '256MB RAM', 'RouterOS L4', '5 Port'],
    weight: 280, dimensions: '11.4 x 13.7 x 3.6 cm',
  },
  {
    name: 'TP-Link Archer AX50', slug: 'tp-link-archer-ax50', sku: 'NET-TPL-AX50',
    category: 'Networking & IT', subcategory: 'Router', brand: 'TP-Link',
    sellingPrice: 420000, originalPrice: 900000, discount: 53, condition: 'Grade A',
    badge: 'HOT DEAL',
    description: 'Router WiFi 6 TP-Link AX50. Kecepatan tinggi, cocok untuk streaming dan gaming.',
    specs: ['WiFi 6 AX3000', 'Gigabit', 'MU-MIMO', 'Beamforming', '4 Port LAN'],
    weight: 550, dimensions: '25.7 x 16.8 x 8.0 cm',
  },
  {
    name: 'MikroTik hAP ac²', slug: 'mikrotik-hap-ac2', sku: 'NET-MIK-HAP2',
    category: 'Networking & IT', subcategory: 'Router', brand: 'MikroTik',
    sellingPrice: 450000, originalPrice: 850000, discount: 47, condition: 'Grade A',
    description: 'MikroTik hAP ac² dual-band. RouterOS, cocok untuk small office / UMKM.',
    specs: ['Dual Band AC', 'Quad-Core CPU', '256MB RAM', 'RouterOS L4', 'PoE Out'],
    weight: 280, dimensions: '11.4 x 13.7 x 3.6 cm',
  },
  {
    name: 'Ubiquiti UniFi AP AC Lite', slug: 'ubiquiti-unifi-ap-ac-lite', sku: 'NET-UBI-APL',
    category: 'Networking & IT', subcategory: 'Access Point', brand: 'Ubiquiti',
    sellingPrice: 550000, originalPrice: 1100000, discount: 50, condition: 'Grade A',
    badge: 'BEST SELLER',
    description: 'Access Point Ubiquiti UniFi AC Lite. Performa enterprise untuk kantor dan rumah.',
    specs: ['Dual Band AC', '867Mbps 5GHz', 'PoE Powered', 'UniFi Controller', '2x2 MIMO'],
    weight: 185, dimensions: '16.0 x 16.0 x 3.1 cm',
  },
  {
    name: 'TP-Link TL-SG1008D 8-Port Switch', slug: 'tp-link-tl-sg1008d-8port', sku: 'NET-TPL-SG8',
    category: 'Networking & IT', subcategory: 'Switch', brand: 'TP-Link',
    sellingPrice: 180000, originalPrice: 350000, discount: 49, condition: 'Like New',
    badge: 'BEST SELLER',
    description: 'Switch gigabit 8 port TP-Link. Plug and play, silent operation, green networking.',
    specs: ['8 Port Gigabit', 'Plug & Play', 'Fanless', 'MDI/MDIX', '48Gbps Backplane'],
    weight: 340, dimensions: '19.0 x 12.8 x 2.7 cm',
  },
  {
    name: 'MikroTik RB951Ui-2nD', slug: 'mikrotik-rb951ui-2nd', sku: 'NET-MIK-951',
    category: 'Networking & IT', subcategory: 'Router', brand: 'MikroTik',
    sellingPrice: 320000, originalPrice: 600000, discount: 47, condition: 'Grade A',
    description: 'Router MikroTik hAP lite untuk rumah dan UMKM kecil. RouterOS level 4.',
    specs: ['WiFi N300', '650MHz CPU', '64MB RAM', 'RouterOS L4', 'PoE In'],
    weight: 200, dimensions: '11.3 x 8.9 x 2.8 cm',
  },
  {
    name: 'D-Link DIR-615 Wireless N300', slug: 'd-link-dir-615-wireless-n300', sku: 'NET-DLK-D615',
    category: 'Networking & IT', subcategory: 'Router', brand: 'D-Link',
    sellingPrice: 150000, originalPrice: 299000, discount: 50, condition: 'Grade B+',
    description: 'Router D-Link DIR-615 untuk rumah. Wireless N300, mudah setup, harga terjangkau.',
    specs: ['Wireless N300', '4 Port Fast Ethernet', 'WPS Button', 'WPA2', 'Parental Control'],
    weight: 220, dimensions: '19.2 x 12.5 x 3.2 cm',
  },
  {
    name: 'Ubiquiti UniFi USW-Lite-8-PoE', slug: 'ubiquiti-unifi-usw-lite-8-poe', sku: 'NET-UBI-SW8',
    category: 'Networking & IT', subcategory: 'Switch', brand: 'Ubiquiti',
    sellingPrice: 850000, originalPrice: 1650000, discount: 48, condition: 'Grade A',
    badge: 'NEW',
    description: 'Switch managed UniFi 8 port PoE. Managed via UniFi Network Application.',
    specs: ['8 Port Gigabit', '4 PoE Ports', '42W PoE Budget', 'Fanless', 'UniFi Managed'],
    weight: 460, dimensions: '16.0 x 12.0 x 3.2 cm',
  },
  {
    name: 'Tenda AC10 WiFi Router', slug: 'tenda-ac10-wifi-router', sku: 'NET-TEN-AC10',
    category: 'Networking & IT', subcategory: 'Router', brand: 'Tenda',
    sellingPrice: 180000, originalPrice: 350000, discount: 49, condition: 'Grade A',
    description: 'Router Tenda AC10 dual-band. WiFi AC1200, MU-MIMO, harga sangat terjangkau.',
    specs: ['WiFi AC1200', 'Dual Band', 'MU-MIMO', '4 Port Gigabit', 'App Control'],
    weight: 310, dimensions: '24.0 x 15.8 x 3.8 cm',
  },
  {
    name: 'MikroTik hEX S (RB760iGS)', slug: 'mikrotik-hex-s-rb760igs', sku: 'NET-MIK-HEXS',
    category: 'Networking & IT', subcategory: 'Router', brand: 'MikroTik',
    sellingPrice: 550000, originalPrice: 1050000, discount: 48, condition: 'Grade A',
    badge: 'HOT DEAL',
    description: 'MikroTik hEX S dengan SFP. RouterOS, USB, PoE output, enclored case.',
    specs: ['880MHz CPU', '256MB RAM', '5 Gigabit + SFP', 'USB 2.0', 'RouterOS L5'],
    weight: 440, dimensions: '11.4 x 13.7 x 3.6 cm',
  },

  // ═══ PERIPHERAL & AKSESORIS (10) ═══
  {
    name: 'Logitech MX Master 3', slug: 'logitech-mx-master-3', sku: 'PER-LOG-MXM3',
    category: 'Peripheral & Aksesoris', subcategory: 'Mouse', brand: 'Logitech',
    sellingPrice: 650000, originalPrice: 1299000, discount: 50, condition: 'Like New',
    badge: 'BEST SELLER', isFeatured: true,
    description: 'Mouse wireless premium Logitech MX Master 3. Ergonomis, multi-device, USB-C charging.',
    specs: ['Wireless', 'USB-C', '4000 DPI', 'Multi-Device', 'Thumb Wheel'],
    weight: 141, dimensions: '12.4 x 8.4 x 5.1 cm',
  },
  {
    name: 'Logitech MX Keys Keyboard', slug: 'logitech-mx-keys-keyboard', sku: 'PER-LOG-MXK',
    category: 'Peripheral & Aksesoris', subcategory: 'Keyboard', brand: 'Logitech',
    sellingPrice: 750000, originalPrice: 1499000, discount: 50, condition: 'Like New',
    badge: 'BEST SELLER',
    description: 'Keyboard wireless Logitech MX Keys. Backlight, smart illumination, multi-device.',
    specs: ['Wireless', 'Backlight', 'Multi-Device', 'USB-C', 'Perfect Stroke Keys'],
    weight: 810, dimensions: '43.0 x 13.0 x 2.0 cm',
  },
  {
    name: 'Razer DeathAdder V2', slug: 'razer-deathadder-v2', sku: 'PER-RAZ-DAV2',
    category: 'Peripheral & Aksesoris', subcategory: 'Mouse Gaming', brand: 'Razer',
    sellingPrice: 350000, originalPrice: 699000, discount: 50, condition: 'Grade A',
    badge: 'HOT DEAL',
    description: 'Mouse gaming Razer DeathAdder V2. Sensor optical 20K DPI, switches optical.',
    specs: ['20K DPI Optical', '8 Buttons', 'Optical Switches', 'Chroma RGB', '63g'],
    weight: 82, dimensions: '12.7 x 6.17 x 4.27 cm',
  },
  {
    name: 'Keychron K2 V2 Mechanical', slug: 'keychron-k2-v2-mechanical', sku: 'PER-KEY-K2V2',
    category: 'Peripheral & Aksesoris', subcategory: 'Keyboard', brand: 'Keychron',
    sellingPrice: 550000, originalPrice: 999000, discount: 45, condition: 'Grade A',
    description: 'Keyboard mechanical Keychron K2. Wireless, hot-swappable, RGB, Mac & Windows.',
    specs: ['Wireless BT 5.1', 'Hot-Swappable', 'RGB Backlit', 'Gateron Switch', '75% Layout'],
    weight: 770, dimensions: '31.5 x 12.6 x 3.1 cm',
  },
  {
    name: 'HyperX Cloud II Gaming Headset', slug: 'hyperx-cloud-ii-gaming-headset', sku: 'PER-HYP-CLD2',
    category: 'Peripheral & Aksesoris', subcategory: 'Headphone', brand: 'HyperX',
    sellingPrice: 450000, originalPrice: 999000, discount: 55, condition: 'Grade A',
    badge: 'HOT DEAL',
    description: 'Headset gaming HyperX Cloud II. Virtual 7.1 surround, memory foam, aluminum frame.',
    specs: ['Virtual 7.1 Surround', '53mm Drivers', 'Memory Foam', 'Detachable Mic', 'USB DAC'],
    weight: 309, dimensions: '22.0 x 10.5 x 21.0 cm',
  },
  {
    name: 'Logitech C920 HD Pro Webcam', slug: 'logitech-c920-hd-pro-webcam', sku: 'PER-LOG-C920',
    category: 'Peripheral & Aksesoris', subcategory: 'Kamera', brand: 'Logitech',
    sellingPrice: 280000, originalPrice: 599000, discount: 53, condition: 'Grade A',
    badge: 'BEST SELLER',
    description: 'Webcam Logitech C920 HD Pro. 1080p 30fps, stereo mic, autofocus.',
    specs: ['1080p 30fps', 'Stereo Mic', 'Autofocus', 'Wide 78° FOV', 'USB 2.0'],
    weight: 162, dimensions: '10.0 x 7.0 x 5.0 cm',
  },
  {
    name: 'SteelSeries Arctis 7', slug: 'steelseries-arctis-7', sku: 'PER-SS-A7',
    category: 'Peripheral & Aksesoris', subcategory: 'Headphone', brand: 'SteelSeries',
    sellingPrice: 550000, originalPrice: 1299000, discount: 58, condition: 'Grade A',
    description: 'Headset wireless SteelSeries Arctis 7. DTS Headphone:X v2, 24 jam battery.',
    specs: ['Wireless 2.4GHz', 'DTS v2', '24hr Battery', 'ClearCast Mic', 'Discord Certified'],
    weight: 353, dimensions: '18.5 x 10.0 x 20.0 cm',
  },
  {
    name: 'Corsair K70 RGB Mechanical', slug: 'corsair-k70-rgb-mechanical', sku: 'PER-COR-K70',
    category: 'Peripheral & Aksesoris', subcategory: 'Keyboard', brand: 'Corsair',
    sellingPrice: 500000, originalPrice: 1099000, discount: 55, condition: 'Grade A',
    description: 'Keyboard mechanical Corsair K70 RGB. Cherry MX, aluminum frame, per-key RGB.',
    specs: ['Cherry MX Red', 'Per-key RGB', 'Aluminum Frame', 'USB Pass-through', 'Full N-Key'],
    weight: 1250, dimensions: '43.8 x 16.6 x 3.7 cm',
  },
  {
    name: 'Anker PowerPort III 65W GaN', slug: 'anker-powerport-iii-65w-gan', sku: 'PER-ANK-65W',
    category: 'Peripheral & Aksesoris', subcategory: 'Charger', brand: 'Anker',
    sellingPrice: 250000, originalPrice: 549000, discount: 54, condition: 'Like New',
    badge: 'NEW',
    description: 'Charger GaN Anker 65W. Compact, 3 port (2 USB-C + 1 USB-A), fast charging.',
    specs: ['65W Output', 'GaN Tech', '2x USB-C + 1x USB-A', 'PD 3.0', 'Compact Size'],
    weight: 155, dimensions: '5.0 x 5.0 x 3.2 cm',
  },
  {
    name: 'Logitech G304 Lightspeed Mouse', slug: 'logitech-g304-lightspeed', sku: 'PER-LOG-G304',
    category: 'Peripheral & Aksesoris', subcategory: 'Mouse Gaming', brand: 'Logitech',
    sellingPrice: 280000, originalPrice: 549000, discount: 49, condition: 'Grade A',
    description: 'Mouse gaming wireless Logitech G304. HERO sensor 12K DPI, 250 jam battery.',
    specs: ['12K DPI HERO', 'Wireless LIGHTSPEED', '250hr Battery', '6 Buttons', '100g'],
    weight: 99, dimensions: '11.6 x 6.2 x 3.8 cm',
  },
];

// Category mapping
const categoryMap: Record<string, { subcats: Record<string, string> }> = {
  'Laptop & Notebook': {
    subcats: {
      'Ultrabook': 'ultrabook',
      'Laptop Gaming': 'laptop-gaming',
      'Laptop Kantor': 'laptop-kantor',
    },
  },
  'Smartphone & Tablet': {
    subcats: {
      'Smartphone': 'smartphone',
      'Tablet': 'tablet',
    },
  },
  'Monitor & TV': {
    subcats: {
      'Monitor': 'monitor',
      'Monitor Gaming': 'monitor-gaming',
      'TV': 'tv',
    },
  },
  'Networking & IT': {
    subcats: {
      'Router': 'router',
      'Access Point': 'access-point',
      'Switch': 'switch',
    },
  },
  'Peripheral & Aksesoris': {
    subcats: {
      'Mouse': 'mouse',
      'Mouse Gaming': 'mouse',
      'Keyboard': 'keyboard',
      'Headphone': 'headphone',
      'Kamera': 'mouse', // fallback
      'Charger': 'mouse', // fallback
    },
  },
};

// Condition to grade mapping
const conditionToGrade: Record<string, string> = {
  'Like New': 'A+',
  'Grade A': 'A',
  'Grade B+': 'B+',
  'Grade B': 'B',
  'Grade C': 'C',
};

// HPP margin per category (base cost = sellingPrice * (1 - margin))
const hppMargin: Record<string, number> = {
  'Laptop & Notebook': 0.65,
  'Smartphone & Tablet': 0.70,
  'Monitor & TV': 0.75,
  'Networking & IT': 0.60,
  'Peripheral & Aksesoris': 0.55,
};

async function main() {
  console.log('🚀 Migrating all 50 products to database...\n');

  // Get existing categories, brands, grades
  const categories = await prisma.category.findMany();
  const brands = await prisma.brand.findMany();
  const grades = await prisma.conditionGrade.findMany();
  const subcategories = await prisma.subCategory.findMany();

  const catMap = new Map(categories.map(c => [c.name, c]));
  const brandMap = new Map(brands.map(b => [b.name, b]));
  const gradeMap = new Map(grades.map(g => [g.code, g]));
  const subcatMap = new Map(subcategories.map(s => [s.slug, s]));

  console.log(`Found: ${categories.length} categories, ${brands.length} brands, ${grades.length} grades, ${subcategories.length} subcategories\n`);

  let created = 0;
  let skipped = 0;

  for (const product of allProducts) {
    try {
      // Check if already exists
      const existing = await prisma.product.findUnique({ where: { slug: product.slug } });
      if (existing) {
        console.log(`⏭️  Skipping (exists): ${product.name}`);
        skipped++;
        continue;
      }

      const cat = catMap.get(product.category);
      if (!cat) {
        console.log(`❌ Category not found: ${product.category} for ${product.name}`);
        continue;
      }

      const brand = brandMap.get(product.brand);
      const subcatSlug = categoryMap[product.category]?.subcats[product.subcategory];
      const subcat = subcatSlug ? subcatMap.get(subcatSlug) : null;
      const grade = gradeMap.get(conditionToGrade[product.condition] || 'A');

      // Calculate HPP (Harga Pokok)
      const margin = hppMargin[product.category] || 0.65;
      const hpp = Math.round(product.sellingPrice * margin);

      // Create product
      const createdProduct = await prisma.product.create({
        data: {
          name: product.name,
          slug: product.slug,
          sku: product.sku,
          description: product.description,
          categoryId: cat.id,
          subcategoryId: subcat?.id || null,
          brandId: brand?.id || null,
          basePrice: hpp,
          sellingPrice: product.sellingPrice,
          discount: product.discount,
          weight: product.weight,
          dimensions: product.dimensions,
          badge: product.badge || null,
          isFeatured: product.isFeatured || false,
          isActive: true,
          publishedAt: new Date(),
          avgRating: 4.5,
          reviewCount: Math.floor(Math.random() * 150) + 10,
          specs: {
            create: product.specs.map((spec, index) => {
              const parts = spec.split(':');
              const key = parts[0]?.trim() || `Spec ${index + 1}`;
              const value = parts[1]?.trim() || spec;
              return { key, value, sortOrder: index };
            }),
          },
        },
      });

      // Create 3 units per product (varying grades)
      const unitGrades = [
        { code: product.condition === 'Like New' ? 'A+' : product.condition === 'Grade A' ? 'A' : product.condition === 'Grade B+' ? 'B+' : 'A', score: 95 },
        { code: product.condition === 'Like New' ? 'A' : product.condition === 'Grade A' ? 'B+' : 'B', score: 85 },
        { code: product.condition === 'Like New' ? 'A' : product.condition === 'Grade A' ? 'B+' : 'B+', score: 78 },
      ];

      for (let i = 0; i < 3; i++) {
        const unitGrade = unitGrades[i];
        const gradeData = gradeMap.get(unitGrade.code) || grade || gradeMap.get('A')!;

        const priceMultiplier = [1.0, 0.9, 0.8][i];
        const unitPrice = Math.round(product.sellingPrice * priceMultiplier / 1000) * 1000;

        await prisma.productUnit.create({
          data: {
            productId: createdProduct.id,
            unitSku: `${product.sku}-${String(i + 1).padStart(3, '0')}`,
            conditionGradeId: gradeData.id,
            conditionScore: unitGrade.score,
            conditionNotes: i === 0 ? 'Kondisi sempurna' : i === 1 ? 'Ada lecet minor' : 'Lecet pemakaian normal',
            batteryHealth: product.category === 'Smartphone & Tablet' || product.category === 'Laptop & Notebook'
              ? 95 - (i * 8) : null,
            purchasePrice: hpp,
            sellingPrice: unitPrice,
            originalPrice: product.originalPrice,
            status: 'AVAILABLE',
          },
        });
      }

      console.log(`✅ Created: ${product.name} (${product.sku}) - 3 units`);
      created++;
    } catch (error: any) {
      console.log(`❌ Error creating ${product.name}: ${error.message}`);
    }
  }

  // Update category product counts
  for (const cat of categories) {
    const count = await prisma.productUnit.count({
      where: {
        product: { categoryId: cat.id },
        status: 'AVAILABLE',
      },
    });
    console.log(`📊 ${cat.name}: ${count} units available`);
  }

  console.log(`\n🎉 Migration complete!`);
  console.log(`   Created: ${created} products (${created * 3} units)`);
  console.log(`   Skipped: ${skipped} (already exist)`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
