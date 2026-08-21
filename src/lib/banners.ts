export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  highlight: string;
  description: string;
  cta: string;
  href: string;
  bg: string; // gradient class
  imageBase64?: string; // gambar banner
  active: boolean;
}

export interface PromoCard {
  id: string;
  title: string;
  subtitle: string;
  price: string;
  description: string;
  href: string;
  bg: string; // gradient class
  imageBase64?: string;
  active: boolean;
}

const BANNERS_KEY = "beliseken_banners";
const PROMO_CARDS_KEY = "beliseken_promo_cards";

const defaultBanners: Banner[] = [
  {
    id: "1",
    title: "Elektronik Bekas",
    subtitle: "Berkualitas & Terjamin",
    highlight: "Hemat Hingga 70%",
    description: "Garansi 30 hari, pengiriman aman ke seluruh Indonesia",
    cta: "Lihat Katalog",
    href: "/products",
    bg: "from-brand to-brand-dark",
    active: true,
  },
  {
    id: "2",
    title: "Flash Sale",
    subtitle: "Hari Ini Saja",
    highlight: "Mulai Rp100rb-an",
    description: "Jangan sampai kehabisan, stok terbatas!",
    cta: "Buruan Beli",
    href: "/products",
    bg: "from-rose-600 to-orange-500",
    active: true,
  },
  {
    id: "3",
    title: "Jual Barang Bekas",
    subtitle: "Mudah & Cepat",
    highlight: "Harga Terbaik",
    description: "Foto, kirim, dapat uang. Praktis!",
    cta: "Jual Sekarang",
    href: "/sell",
    bg: "from-emerald-600 to-teal-500",
    active: true,
  },
];

const defaultPromoCards: PromoCard[] = [
  {
    id: "1",
    title: "💻 Laptop & Notebook",
    subtitle: "Mulai 3.5 Juta",
    price: "Mulai 3.5 Juta",
    description: "MacBook, ThinkPad, ASUS ROG & lainnya",
    href: "/category/laptop-notebook",
    bg: "from-blue-500 to-blue-600",
    active: true,
  },
  {
    id: "2",
    title: "📱 Smartphone & Tablet",
    subtitle: "Mulai 1.2 Juta",
    price: "Mulai 1.2 Juta",
    description: "iPhone, Samsung, iPad & lainnya",
    href: "/category/smartphone-tablet",
    bg: "from-emerald-500 to-emerald-600",
    active: true,
  },
  {
    id: "3",
    title: "🌐 Networking & IT",
    subtitle: "Mulai Rp150rb",
    price: "Mulai Rp150rb",
    description: "MikroTik, TP-Link, Ubiquiti & lainnya",
    href: "/category/networking-it",
    bg: "from-amber-500 to-orange-500",
    active: true,
  },
];

// ── Banners ──

export function getBanners(): Banner[] {
  if (typeof window === "undefined") return defaultBanners;
  try {
    const stored = localStorage.getItem(BANNERS_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.length > 0) return parsed;
    }
  } catch {}
  return defaultBanners;
}

export function saveBanners(banners: Banner[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(BANNERS_KEY, JSON.stringify(banners));
}

export function getActiveBanners(): Banner[] {
  return getBanners().filter((b) => b.active);
}

export function addBanner(banner: Omit<Banner, "id">): Banner {
  const banners = getBanners();
  const newBanner: Banner = { ...banner, id: String(Date.now()) };
  banners.push(newBanner);
  saveBanners(banners);
  return newBanner;
}

export function updateBanner(id: string, updates: Partial<Banner>): Banner | null {
  const banners = getBanners();
  const idx = banners.findIndex((b) => b.id === id);
  if (idx === -1) return null;
  banners[idx] = { ...banners[idx], ...updates };
  saveBanners(banners);
  return banners[idx];
}

export function deleteBanner(id: string): boolean {
  const banners = getBanners();
  const filtered = banners.filter((b) => b.id !== id);
  if (filtered.length === banners.length) return false;
  saveBanners(filtered);
  return true;
}

// ── Promo Cards ──

export function getPromoCards(): PromoCard[] {
  if (typeof window === "undefined") return defaultPromoCards;
  try {
    const stored = localStorage.getItem(PROMO_CARDS_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.length > 0) return parsed;
    }
  } catch {}
  return defaultPromoCards;
}

export function savePromoCards(cards: PromoCard[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(PROMO_CARDS_KEY, JSON.stringify(cards));
}

export function getActivePromoCards(): PromoCard[] {
  return getPromoCards().filter((c) => c.active);
}

export function addPromoCard(card: Omit<PromoCard, "id">): PromoCard {
  const cards = getPromoCards();
  const newCard: PromoCard = { ...card, id: String(Date.now()) };
  cards.push(newCard);
  savePromoCards(cards);
  return newCard;
}

export function updatePromoCard(id: string, updates: Partial<PromoCard>): PromoCard | null {
  const cards = getPromoCards();
  const idx = cards.findIndex((c) => c.id === id);
  if (idx === -1) return null;
  cards[idx] = { ...cards[idx], ...updates };
  savePromoCards(cards);
  return cards[idx];
}

export function deletePromoCard(id: string): boolean {
  const cards = getPromoCards();
  const filtered = cards.filter((c) => c.id !== id);
  if (filtered.length === cards.length) return false;
  savePromoCards(filtered);
  return true;
}
