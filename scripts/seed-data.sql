-- ══════════════════════════════════════════════════════════════
-- BeliSeken.com — Seed Data
-- ══════════════════════════════════════════════════════════════

-- KATEGORIES
INSERT INTO categories (id, name, slug, icon, color, "sortOrder", "isActive", "createdAt", "updatedAt") VALUES
('cat-laptop', 'Laptop & Notebook', 'laptop-notebook', '💻', '#3B82F6', 1, true, NOW(), NOW()),
('cat-smartphone', 'Smartphone & Tablet', 'smartphone-tablet', '📱', '#10B981', 2, true, NOW(), NOW()),
('cat-monitor', 'Monitor & TV', 'monitor-tv', '🖥️', '#8B5CF6', 3, true, NOW(), NOW()),
('cat-network', 'Networking & IT', 'networking-it', '🌐', '#F59E0B', 4, true, NOW(), NOW()),
('cat-peripheral', 'Peripheral & Aksesoris', 'peripheral-aksesoris', '⌨️', '#EF4444', 5, true, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- CONDITION GRADES
INSERT INTO condition_grades (id, "code", name, description, "minScore", "maxScore", "priceModifier", "sortOrder", "isActive", "createdAt", "updatedAt") VALUES
('grade-a+', 'A+', 'Like New', 'Sempurna, seperti baru, tidak ada cacat', 95, 100, 1.0, 1, true, NOW(), NOW()),
('grade-a', 'A', 'Mulus', 'Sangat mulus, minimal pemakaian, tidak ada lecet', 85, 94, 0.92, 2, true, NOW(), NOW()),
('grade-b', 'B', 'Baik', 'Lecet pemakaian normal, fungsi 100%', 70, 84, 0.82, 3, true, NOW(), NOW()),
('grade-c', 'C', 'Fair', 'Lecet cukup banyak, fungsi masih jalan', 50, 69, 0.70, 4, true, NOW(), NOW()),
('grade-d', 'D', 'Minus', 'Minus fungsi, ada masalah tertentu', 30, 49, 0.55, 5, true, NOW(), NOW()),
('grade-parts', 'P', 'Parts Only', 'Hanya untuk spareparts, tidak bisa dipakai normal', 0, 29, 0.35, 6, true, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- BRANDS
INSERT INTO brands (id, name, slug, "isActive", "createdAt", "updatedAt") VALUES
('brand-apple', 'Apple', 'apple', true, NOW(), NOW()),
('brand-lenovo', 'Lenovo', 'lenovo', true, NOW(), NOW()),
('brand-asus', 'ASUS', 'asus', true, NOW(), NOW()),
('brand-dell', 'Dell', 'dell', true, NOW(), NOW()),
('brand-hp', 'HP', 'hp', true, NOW(), NOW()),
('brand-samsung', 'Samsung', 'samsung', true, NOW(), NOW()),
('brand-xiaomi', 'Xiaomi', 'xiaomi', true, NOW(), NOW()),
('brand-sony', 'Sony', 'sony', true, NOW(), NOW()),
('brand-logitech', 'Logitech', 'logitech', true, NOW(), NOW()),
('brand-tp-link', 'TP-Link', 'tp-link', true, NOW(), NOW()),
('brand-mikrotik', 'MikroTik', 'mikrotik', true, NOW(), NOW()),
('brand-hyperx', 'HyperX', 'hyperx', true, NOW(), NOW()),
('brand-razer', 'Razer', 'razer', true, NOW(), NOW()),
('brand-steelseries', 'SteelSeries', 'steelseries', true, NOW(), NOW()),
('brand-ubiquiti', 'Ubiquiti', 'ubiquiti', true, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- USERS (Admin)
INSERT INTO users (id, email, name, password, role, "createdAt", "updatedAt") VALUES
('user-admin', 'admin@beliseken.com', 'Admin BeliSeken', '$2a$10$YF1J4qKjGz3sKjGz3sKjGuYF1J4qKjGz3sKjGz3sKjGuYF1J4qKj', 'ADMIN', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- ADMIN CREDENTIALS: admin@beliseken.com / 123456
