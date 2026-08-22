-- ══════════════════════════════════════════════════════════════
-- BeliSeken.com — Seed Products (50 items) with SKU
-- ══════════════════════════════════════════════════════════════

-- LAPTOP & NOTEBOOK
INSERT INTO products (id, name, slug, sku, "categoryId", "brandId", "basePrice", "sellingPrice", discount, "avgRating", "reviewCount", "isActive", "isFeatured", badge, weight, dimensions, description, "createdAt", "updatedAt") VALUES
('prod-1', 'MacBook Air M1 2020', 'macbook-air-m1-2020', 'LAP-001', 'cat-laptop', 'brand-apple', 12999000, 6500000, 50, 4.8, 124, true, true, 'HOT DEAL', 1290, '30.41 x 21.24 x 1.61 cm', 'MacBook Air M1 2020 kondisi like new.', NOW(), NOW()),
('prod-2', 'ThinkPad X1 Carbon Gen 9', 'thinkpad-x1-carbon-gen9', 'LAP-002', 'cat-laptop', 'brand-lenovo', 15500000, 8200000, 47, 4.9, 89, true, true, 'BEST SELLER', 1090, '32.3 x 21.7 x 1.49 cm', 'Lenovo ThinkPad X1 Carbon Gen 9 untuk profesional IT.', NOW(), NOW()),
('prod-3', 'ASUS ROG Strix G14', 'asus-rog-strix-g14', 'LAP-003', 'cat-laptop', 'brand-asus', 17999000, 9800000, 46, 4.8, 67, true, true, 'HOT DEAL', 1700, '32.4 x 22.2 x 1.99 cm', 'Laptop gaming ASUS ROG Strix G14.', NOW(), NOW()),
('prod-4', 'HP ProBook 440 G8', 'hp-probook-440-g8', 'LAP-004', 'cat-laptop', 'brand-hp', 8500000, 4200000, 51, 4.5, 34, true, false, NULL, 1380, '32.4 x 22.5 x 1.90 cm', 'Laptop bisnis HP ProBook 440 G8.', NOW(), NOW()),
('prod-5', 'Dell Latitude 5420', 'dell-latitude-5420', 'LAP-005', 'cat-laptop', 'brand-dell', 11200000, 5500000, 51, 4.6, 45, true, true, 'BEST SELLER', 1410, '32.1 x 21.3 x 1.84 cm', 'Dell Latitude 5420 untuk profesional.', NOW(), NOW()),
('prod-6', 'Lenovo IdeaPad Slim 3', 'lenovo-ideapad-slim-3', 'LAP-006', 'cat-laptop', 'brand-lenovo', 7499000, 3800000, 49, 4.4, 28, true, false, NULL, 1410, '32.7 x 24.1 x 1.99 cm', 'Lenovo IdeaPad Slim 3 ringan dan tipis.', NOW(), NOW()),
('prod-7', 'MacBook Pro 14 M1 Pro', 'macbook-pro-14-m1-pro', 'LAP-007', 'cat-laptop', 'brand-apple', 28999000, 16500000, 43, 4.9, 56, true, true, 'HOT DEAL', 1600, '31.26 x 22.12 x 1.55 cm', 'MacBook Pro 14 M1 Pro untuk kreator konten.', NOW(), NOW()),
('prod-8', 'ASUS VivoBook 14', 'asus-vivobook-14', 'LAP-008', 'cat-laptop', 'brand-asus', 6999000, 3500000, 50, 4.3, 19, true, false, NULL, 1400, '32.5 x 21.6 x 1.90 cm', 'ASUS VivoBook 14 untuk sehari-hari.', NOW(), NOW()),
('prod-9', 'Acer Aspire 5', 'acer-aspire-5', 'LAP-009', 'cat-laptop', 'brand-lenovo', 7800000, 3900000, 50, 4.4, 22, true, false, NULL, 1740, '36.3 x 25.1 x 1.80 cm', 'Acer Aspire 5 performa solid.', NOW(), NOW()),
('prod-10', 'Lenovo ThinkPad T480', 'lenovo-thinkpad-t480', 'LAP-010', 'cat-laptop', 'brand-lenovo', 9000000, 4500000, 50, 4.7, 63, true, true, 'BEST SELLER', 1650, '33.6 x 23.2 x 1.99 cm', 'ThinkPad T480 legendary durability.', NOW(), NOW()) ON CONFLICT (id) DO NOTHING;

-- SMARTPHONE & TABLET
INSERT INTO products (id, name, slug, sku, "categoryId", "brandId", "basePrice", "sellingPrice", discount, "avgRating", "reviewCount", "isActive", "isFeatured", badge, weight, dimensions, description, "createdAt", "updatedAt") VALUES
('prod-11', 'iPhone 13 Pro 128GB', 'iphone-13-pro-128gb', 'PHN-001', 'cat-smartphone', 'brand-apple', 8499000, 4800000, 43, 4.7, 203, true, true, 'BEST SELLER', 203, '14.67 x 7.15 x 0.77 cm', 'iPhone 13 Pro 128GB kondisi Grade A.', NOW(), NOW()),
('prod-12', 'Samsung Galaxy S22 Ultra', 'samsung-galaxy-s22-ultra', 'PHN-002', 'cat-smartphone', 'brand-samsung', 5999000, 3200000, 47, 4.5, 156, true, false, NULL, 228, '16.33 x 7.79 x 0.89 cm', 'Samsung Galaxy S22 Ultra dengan S Pen.', NOW(), NOW()),
('prod-13', 'iPhone 14 128GB', 'iphone-14-128gb', 'PHN-003', 'cat-smartphone', 'brand-apple', 9999000, 5200000, 48, 4.6, 89, true, true, 'NEW', 172, '14.67 x 7.15 x 0.78 cm', 'iPhone 14 128GB kondisi Grade A.', NOW(), NOW()),
('prod-14', 'Samsung Galaxy A54', 'samsung-galaxy-a54', 'PHN-004', 'cat-smartphone', 'brand-samsung', 4499000, 2200000, 51, 4.4, 78, true, false, NULL, 202, '15.82 x 7.67 x 0.82 cm', 'Samsung Galaxy A54 mid-range premium.', NOW(), NOW()),
('prod-15', 'iPad Air M1 64GB', 'ipad-air-m1-64gb', 'PHN-005', 'cat-smartphone', 'brand-apple', 9499000, 5800000, 39, 4.8, 67, true, true, 'BEST SELLER', 461, '24.76 x 17.85 x 0.61 cm', 'iPad Air M1 untuk produktivitas.', NOW(), NOW()),
('prod-16', 'Samsung Galaxy Tab S8', 'samsung-galaxy-tab-s8', 'PHN-006', 'cat-smartphone', 'brand-samsung', 5999000, 3200000, 47, 4.6, 42, true, false, NULL, 502, '25.38 x 16.53 x 0.63 cm', 'Samsung Galaxy Tab S8 untuk multitasking.', NOW(), NOW()),
('prod-17', 'Xiaomi Redmi Note 12', 'xiaomi-redmi-note-12', 'PHN-007', 'cat-smartphone', 'brand-xiaomi', 2499000, 1200000, 52, 4.3, 112, true, true, 'HOT DEAL', 183, '16.59 x 7.62 x 0.80 cm', 'Xiaomi Redmi Note 12 value for money.', NOW(), NOW()),
('prod-18', 'iPhone 12 Mini 64GB', 'iphone-12-mini-64gb', 'PHN-008', 'cat-smartphone', 'brand-apple', 5999000, 2800000, 53, 4.5, 95, true, false, NULL, 135, '13.15 x 6.42 x 0.74 cm', 'iPhone 12 Mini compact flagship.', NOW(), NOW()),
('prod-19', 'Samsung Galaxy Tab A8', 'samsung-galaxy-tab-a8', 'PHN-009', 'cat-smartphone', 'brand-samsung', 3499000, 1800000, 49, 4.2, 56, true, false, NULL, 508, '24.68 x 16.13 x 0.69 cm', 'Samsung Galaxy Tab A8 untuk hiburan.', NOW(), NOW()),
('prod-20', 'Realme GT Neo 3', 'realme-gt-neo-3', 'PHN-010', 'cat-smartphone', 'brand-xiaomi', 3999000, 1800000, 55, 4.4, 34, true, true, 'NEW', 194, '16.33 x 7.56 x 0.82 cm', 'Realme GT Neo 3 performa gaming.', NOW(), NOW()) ON CONFLICT (id) DO NOTHING;

-- MONITOR & TV
INSERT INTO products (id, name, slug, sku, "categoryId", "brandId", "basePrice", "sellingPrice", discount, "avgRating", "reviewCount", "isActive", "isFeatured", badge, weight, dimensions, description, "createdAt", "updatedAt") VALUES
('prod-21', 'Dell UltraSharp U2720Q 4K', 'dell-u2720q-4k', 'MON-001', 'cat-monitor', 'brand-dell', 5200000, 2900000, 44, 4.6, 45, true, true, 'NEW', 6600, '61.1 x 22.0 x 51.5 cm', 'Monitor 4K 27 inch untuk desain.', NOW(), NOW()),
('prod-22', 'LG 27GN800-B UltraGear', 'lg-27gn800b-ultragear', 'MON-002', 'cat-monitor', 'brand-dell', 3499000, 1800000, 49, 4.7, 78, true, true, 'BEST SELLER', 5800, '61.3 x 23.7 x 45.8 cm', 'Monitor gaming LG UltraGear 27 inch.', NOW(), NOW()),
('prod-23', 'Samsung LU32J390 4K 32 inch', 'samsung-lu32j390-4k-32', 'MON-003', 'cat-monitor', 'brand-samsung', 2999000, 1500000, 50, 4.4, 56, true, false, NULL, 7500, '73.0 x 22.0 x 59.7 cm', 'Monitor Samsung 4K 32 inch.', NOW(), NOW()),
('prod-24', 'LG 55UN7300 55 inch Smart TV', 'lg-55un7300-55-smart-tv', 'MON-004', 'cat-monitor', 'brand-dell', 5499000, 2800000, 49, 4.5, 67, true, true, 'HOT DEAL', 14400, '123.5 x 71.9 x 25.9 cm', 'Smart TV LG 55 inch 4K UHD.', NOW(), NOW()),
('prod-25', 'BenQ GW2480 24 inch', 'benq-gw2480-24', 'MON-005', 'cat-monitor', 'brand-dell', 1799000, 900000, 50, 4.5, 92, true, true, 'BEST SELLER', 3700, '54.0 x 22.5 x 40.2 cm', 'Monitor BenQ 24 inch eye-care.', NOW(), NOW()),
('prod-26', 'Asus ProArt PA278QV 27 inch', 'asus-proart-pa278qv-27', 'MON-006', 'cat-monitor', 'brand-asus', 4299000, 2200000, 49, 4.7, 34, true, false, NULL, 7120, '61.4 x 23.0 x 50.5 cm', 'Monitor ASUS ProArt untuk desainer.', NOW(), NOW()),
('prod-27', 'Hisense 43A6500 43 inch Smart TV', 'hisense-43a6500-43-smart-tv', 'MON-007', 'cat-monitor', 'brand-dell', 2999000, 1500000, 50, 4.3, 23, true, false, NULL, 7800, '96.5 x 56.2 x 18.5 cm', 'Smart TV Hisense 43 inch.', NOW(), NOW()),
('prod-28', 'Samsung Odyssey G5 27 inch', 'samsung-odyssey-g5-27', 'MON-008', 'cat-monitor', 'brand-samsung', 3799000, 1900000, 50, 4.6, 45, true, true, 'HOT DEAL', 5500, '61.7 x 24.4 x 47.3 cm', 'Monitor gaming Samsung Odyssey G5.', NOW(), NOW()),
('prod-29', 'Philips 242M1 24 inch', 'philips-242m1-24', 'MON-009', 'cat-monitor', 'brand-dell', 2499000, 1200000, 52, 4.4, 28, true, false, NULL, 4200, '55.5 x 22.0 x 40.2 cm', 'Monitor Philips 24 inch gaming.', NOW(), NOW()),
('prod-30', 'Coocaa 32S7G 32 inch Smart TV', 'coocaa-32s7g-32-smart-tv', 'MON-010', 'cat-monitor', 'brand-dell', 2199000, 1100000, 50, 4.2, 18, true, true, 'NEW', 4500, '73.0 x 45.6 x 18.0 cm', 'Smart TV Coocaa 32 inch Android TV.', NOW(), NOW()) ON CONFLICT (id) DO NOTHING;

-- NETWORKING & IT
INSERT INTO products (id, name, slug, sku, "categoryId", "brandId", "basePrice", "sellingPrice", discount, "avgRating", "reviewCount", "isActive", "isFeatured", badge, weight, dimensions, description, "createdAt", "updatedAt") VALUES
('prod-31', 'MikroTik RB750Gr3', 'mikrotik-rb750gr3', 'NET-001', 'cat-network', 'brand-mikrotik', 750000, 380000, 49, 4.6, 88, true, true, 'NEW', 280, '11.4 x 13.7 x 3.6 cm', 'Router MikroTik gigabit untuk UMKM.', NOW(), NOW()),
('prod-32', 'TP-Link Archer AX50', 'tp-link-archer-ax50', 'NET-002', 'cat-network', 'brand-tp-link', 900000, 420000, 53, 4.4, 62, true, true, 'HOT DEAL', 550, '25.7 x 16.8 x 8.0 cm', 'Router WiFi 6 TP-Link AX50.', NOW(), NOW()),
('prod-33', 'MikroTik hAP ac2', 'mikrotik-hap-ac2', 'NET-003', 'cat-network', 'brand-mikrotik', 850000, 450000, 47, 4.5, 45, true, false, NULL, 280, '11.4 x 13.7 x 3.6 cm', 'MikroTik hAP ac2 dual-band.', NOW(), NOW()),
('prod-34', 'Ubiquiti UniFi AP AC Lite', 'ubiquiti-unifi-ap-ac-lite', 'NET-004', 'cat-network', 'brand-ubiquiti', 1100000, 550000, 50, 4.7, 56, true, true, 'BEST SELLER', 185, '16.0 x 16.0 x 3.1 cm', 'Access Point Ubiquiti UniFi AC Lite.', NOW(), NOW()),
('prod-35', 'TP-Link TL-SG1008D 8-Port Switch', 'tp-link-tl-sg1008d-8port', 'NET-005', 'cat-network', 'brand-tp-link', 350000, 180000, 49, 4.5, 112, true, true, 'BEST SELLER', 340, '19.0 x 12.8 x 2.7 cm', 'Switch gigabit 8 port TP-Link.', NOW(), NOW()),
('prod-36', 'MikroTik RB951Ui-2nD', 'mikrotik-rb951ui-2nd', 'NET-006', 'cat-network', 'brand-mikrotik', 600000, 320000, 47, 4.3, 34, true, false, NULL, 200, '11.3 x 8.9 x 2.8 cm', 'Router MikroTik hAP lite.', NOW(), NOW()),
('prod-37', 'D-Link DIR-615 Wireless N300', 'd-link-dir-615-wireless-n300', 'NET-007', 'cat-network', 'brand-tp-link', 299000, 150000, 50, 4.1, 87, true, false, NULL, 220, '19.2 x 12.5 x 3.2 cm', 'Router D-Link DIR-615 untuk rumah.', NOW(), NOW()),
('prod-38', 'Ubiquiti UniFi USW-Lite-8-PoE', 'ubiquiti-unifi-usw-lite-8-poe', 'NET-008', 'cat-network', 'brand-ubiquiti', 1650000, 850000, 48, 4.6, 23, true, true, 'NEW', 460, '16.0 x 12.0 x 3.2 cm', 'Switch managed UniFi 8 port PoE.', NOW(), NOW()),
('prod-39', 'Tenda AC10 WiFi Router', 'tenda-ac10-wifi-router', 'NET-009', 'cat-network', 'brand-tp-link', 350000, 180000, 49, 4.2, 56, true, false, NULL, 310, '24.0 x 15.8 x 3.8 cm', 'Router Tenda AC10 dual-band.', NOW(), NOW()),
('prod-40', 'MikroTik hEX S (RB760iGS)', 'mikrotik-hex-s-rb760igs', 'NET-010', 'cat-network', 'brand-mikrotik', 1050000, 550000, 48, 4.7, 34, true, true, 'HOT DEAL', 440, '11.4 x 13.7 x 3.6 cm', 'MikroTik hEX S dengan SFP.', NOW(), NOW()) ON CONFLICT (id) DO NOTHING;

-- PERIPHERAL & AKSESORIS
INSERT INTO products (id, name, slug, sku, "categoryId", "brandId", "basePrice", "sellingPrice", discount, "avgRating", "reviewCount", "isActive", "isFeatured", badge, weight, dimensions, description, "createdAt", "updatedAt") VALUES
('prod-41', 'Logitech MX Master 3', 'logitech-mx-master-3', 'PER-001', 'cat-peripheral', 'brand-logitech', 1299000, 650000, 50, 4.9, 201, true, true, 'BEST SELLER', 141, '12.4 x 8.4 x 5.1 cm', 'Mouse wireless premium Logitech MX Master 3.', NOW(), NOW()),
('prod-42', 'Logitech MX Keys Keyboard', 'logitech-mx-keys-keyboard', 'PER-002', 'cat-peripheral', 'brand-logitech', 1499000, 750000, 50, 4.8, 134, true, true, 'BEST SELLER', 810, '43.0 x 13.0 x 2.0 cm', 'Keyboard wireless Logitech MX Keys.', NOW(), NOW()),
('prod-43', 'Razer DeathAdder V2', 'razer-deathadder-v2', 'PER-003', 'cat-peripheral', 'brand-razer', 699000, 350000, 50, 4.7, 89, true, true, 'HOT DEAL', 82, '12.7 x 6.17 x 4.27 cm', 'Mouse gaming Razer DeathAdder V2.', NOW(), NOW()),
('prod-44', 'Keychron K2 V2 Mechanical', 'keychron-k2-v2-mechanical', 'PER-004', 'cat-peripheral', 'brand-logitech', 999000, 550000, 45, 4.6, 67, true, false, NULL, 770, '31.5 x 12.6 x 3.1 cm', 'Keyboard mechanical Keychron K2.', NOW(), NOW()),
('prod-45', 'HyperX Cloud II Gaming Headset', 'hyperx-cloud-ii-gaming-headset', 'PER-005', 'cat-peripheral', 'brand-hyperx', 999000, 450000, 55, 4.8, 178, true, true, 'HOT DEAL', 309, '22.0 x 10.5 x 21.0 cm', 'Headset gaming HyperX Cloud II.', NOW(), NOW()),
('prod-46', 'Logitech C920 HD Pro Webcam', 'logitech-c920-hd-pro-webcam', 'PER-006', 'cat-peripheral', 'brand-logitech', 599000, 280000, 53, 4.5, 156, true, true, 'BEST SELLER', 162, '10.0 x 7.0 x 5.0 cm', 'Webcam Logitech C920 HD Pro.', NOW(), NOW()),
('prod-47', 'SteelSeries Arctis 7', 'steelseries-arctis-7', 'PER-007', 'cat-peripheral', 'brand-steelseries', 1299000, 550000, 58, 4.7, 89, true, false, NULL, 353, '18.5 x 10.0 x 20.0 cm', 'Headset wireless SteelSeries Arctis 7.', NOW(), NOW()),
('prod-48', 'Corsair K70 RGB Mechanical', 'corsair-k70-rgb-mechanical', 'PER-008', 'cat-peripheral', 'brand-logitech', 1099000, 500000, 55, 4.6, 45, true, false, NULL, 1250, '43.8 x 16.6 x 3.7 cm', 'Keyboard mechanical Corsair K70 RGB.', NOW(), NOW()),
('prod-49', 'Anker PowerPort III 65W GaN', 'anker-powerport-iii-65w-gan', 'PER-009', 'cat-peripheral', 'brand-logitech', 549000, 250000, 54, 4.5, 78, true, true, 'NEW', 155, '5.0 x 5.0 x 3.2 cm', 'Charger GaN Anker 65W.', NOW(), NOW()),
('prod-50', 'Logitech G304 Lightspeed Mouse', 'logitech-g304-lightspeed', 'PER-010', 'cat-peripheral', 'brand-logitech', 549000, 280000, 49, 4.7, 134, true, false, NULL, 99, '11.6 x 6.2 x 3.8 cm', 'Mouse gaming wireless Logitech G304.', NOW(), NOW()) ON CONFLICT (id) DO NOTHING;

-- Product Specs (sample)
INSERT INTO product_specs (id, "productId", key, value, "sortOrder") VALUES
('spec-1', 'prod-1', 'RAM', '8GB', 1),
('spec-2', 'prod-1', 'Storage', '256GB SSD', 2),
('spec-3', 'prod-1', 'Processor', 'M1 Chip', 3),
('spec-4', 'prod-1', 'Layar', '13.3 inch Retina', 4),
('spec-5', 'prod-1', 'Baterai', '95%', 5),
('spec-6', 'prod-11', 'Storage', '128GB', 1),
('spec-7', 'prod-11', 'Processor', 'A15 Bionic', 2),
('spec-8', 'prod-11', 'Layar', 'ProMotion 120Hz', 3),
('spec-9', 'prod-11', 'Kondisi', '93%', 4),
('spec-10', 'prod-11', 'Baterai', '89%', 5),
('spec-11', 'prod-31', 'CPU', '750MHz', 1),
('spec-12', 'prod-31', 'RAM', '256MB', 2),
('spec-13', 'prod-31', 'OS', 'RouterOS L4', 3),
('spec-14', 'prod-31', 'Ports', '5 Port Gigabit', 4),
('spec-15', 'prod-41', 'Koneksi', 'Wireless', 1),
('spec-16', 'prod-41', 'Charging', 'USB-C', 2),
('spec-17', 'prod-41', 'DPI', '4000', 3),
('spec-18', 'prod-41', 'Fitur', 'Multi-Device, Thumb Wheel', 4);

-- Product Units (stock per item)
INSERT INTO product_units (id, "productId", "unitSku", "conditionGradeId", "conditionScore", "conditionNotes", "purchasePrice", "sellingPrice", status, "createdAt", "updatedAt") VALUES
('unit-1-1', 'prod-1', 'MBA-M1-001', 'grade-a+', 98, 'Like new, ada dus', 4500000, 6500000, 'AVAILABLE', NOW(), NOW()),
('unit-1-2', 'prod-1', 'MBA-M1-002', 'grade-a', 92, 'Mulus, tanpa dus', 4200000, 6200000, 'AVAILABLE', NOW(), NOW()),
('unit-1-3', 'prod-1', 'MBA-M1-003', 'grade-b', 80, 'Lecet minor di tutup', 3800000, 5800000, 'AVAILABLE', NOW(), NOW()),
('unit-2-1', 'prod-2', 'TPX1C-001', 'grade-a+', 97, 'Sempurna', 6000000, 8200000, 'AVAILABLE', NOW(), NOW()),
('unit-2-2', 'prod-2', 'TPX1C-002', 'grade-a', 90, 'Mulus sekali', 5500000, 7800000, 'AVAILABLE', NOW(), NOW()),
('unit-3-1', 'prod-3', 'ROG-G14-001', 'grade-a', 91, 'Gaming normal', 6500000, 9800000, 'AVAILABLE', NOW(), NOW()),
('unit-3-2', 'prod-3', 'ROG-G14-002', 'grade-b', 82, 'Lecet palm rest', 5800000, 8900000, 'AVAILABLE', NOW(), NOW()),
('unit-4-1', 'prod-4', 'HP440-001', 'grade-a', 88, 'Kantor, mulus', 2800000, 4200000, 'AVAILABLE', NOW(), NOW()),
('unit-5-1', 'prod-5', 'DELL5420-001', 'grade-a', 89, 'Korporat, mulus', 3500000, 5500000, 'AVAILABLE', NOW(), NOW()),
('unit-11-1', 'prod-11', 'IP13P-001', 'grade-a', 93, 'Screen guard, casing', 3200000, 4800000, 'AVAILABLE', NOW(), NOW()),
('unit-11-2', 'prod-11', 'IP13P-002', 'grade-b', 85, 'Lecet minor bezel', 2900000, 4400000, 'AVAILABLE', NOW(), NOW()),
('unit-12-1', 'prod-12', 'S22U-001', 'grade-b', 88, 'S Pen included', 2200000, 3200000, 'AVAILABLE', NOW(), NOW()),
('unit-13-1', 'prod-13', 'IP14-001', 'grade-a', 95, 'Seperti baru', 3500000, 5200000, 'AVAILABLE', NOW(), NOW()),
('unit-15-1', 'prod-15', 'IPAD-AIR-001', 'grade-a+', 96, 'Like new full set', 3800000, 5800000, 'AVAILABLE', NOW(), NOW()),
('unit-17-1', 'prod-17', 'RN12-001', 'grade-a', 90, 'Mulus', 650000, 1200000, 'AVAILABLE', NOW(), NOW()),
('unit-21-1', 'prod-21', 'DELL-U27-001', 'grade-a', 92, 'Monitor mulus', 1800000, 2900000, 'AVAILABLE', NOW(), NOW()),
('unit-22-1', 'prod-22', 'LG-27GN-001', 'grade-a', 94, 'Gaming normal', 1100000, 1800000, 'AVAILABLE', NOW(), NOW()),
('unit-28-1', 'prod-28', 'ODG5-001', 'grade-a', 91, 'Curved mulus', 1200000, 1900000, 'AVAILABLE', NOW(), NOW()),
('unit-31-1', 'prod-31', 'RB750G-001', 'grade-a+', 99, 'Baru', 250000, 380000, 'AVAILABLE', NOW(), NOW()),
('unit-31-2', 'prod-31', 'RB750G-002', 'grade-a', 95, 'Pemakaian ringan', 220000, 350000, 'AVAILABLE', NOW(), NOW()),
('unit-34-1', 'prod-34', 'UAPL-001', 'grade-a', 93, 'Enterprise pull', 350000, 550000, 'AVAILABLE', NOW(), NOW()),
('unit-35-1', 'prod-35', 'TLSG8-001', 'grade-a+', 98, 'Like new', 120000, 180000, 'AVAILABLE', NOW(), NOW()),
('unit-41-1', 'prod-41', 'MXM3-001', 'grade-a+', 97, 'Like new, ada dus', 420000, 650000, 'AVAILABLE', NOW(), NOW()),
('unit-41-2', 'prod-41', 'MXM3-002', 'grade-a', 92, 'Mulus', 380000, 600000, 'AVAILABLE', NOW(), NOW()),
('unit-42-1', 'prod-42', 'MXKEY-001', 'grade-a+', 96, 'Full set', 480000, 750000, 'AVAILABLE', NOW(), NOW()),
('unit-43-1', 'prod-43', 'DAV2-001', 'grade-a', 93, 'Gaming mouse mulus', 220000, 350000, 'AVAILABLE', NOW(), NOW()),
('unit-45-1', 'prod-45', 'HX-CL2-001', 'grade-a', 90, 'Headset mulus', 280000, 450000, 'AVAILABLE', NOW(), NOW()),
('unit-46-1', 'prod-46', 'C920-001', 'grade-a', 95, 'Webcam mulus', 180000, 280000, 'AVAILABLE', NOW(), NOW()),
('unit-50-1', 'prod-50', 'G304-001', 'grade-a', 94, 'Mouse gaming mulus', 180000, 280000, 'AVAILABLE', NOW(), NOW()) ON CONFLICT (id) DO NOTHING;
