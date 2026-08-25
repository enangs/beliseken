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
    title: "Laptop & Notebook",
    subtitle: "Mulai 3.5 Juta",
    price: "Mulai 3.5 Juta",
    description: "MacBook, ThinkPad, ASUS ROG & lainnya",
    href: "/category/laptop-notebook",
    bg: "from-blue-500 to-blue-600",
    active: true,
  },
  {
    id: "2",
    title: "Smartphone & Tablet",
    subtitle: "Mulai 1.2 Juta",
    price: "Mulai 1.2 Juta",
    description: "iPhone, Samsung, iPad & lainnya",
    href: "/category/smartphone-tablet",
    bg: "from-emerald-500 to-emerald-600",
    active: true,
  },
  {
    id: "3",
    title: "Networking & IT",
    subtitle: "Mulai Rp150rb",
    price: "Mulai Rp150rb",
    description: "MikroTik, TP-Link, Ubiquiti & lainnya",
    href: "/category/networking-it",
    bg: "from-amber-500 to-orange-500",
    active: true,
  },
];

// ── Banners ──

export async function getBanners(): Promise<Banner[]> {
  try {
    const res = await fetch('/api/banners', { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.data?.length > 0) return data.data;
    }
  } catch {}
  return defaultBanners;
}

export async function saveBanners(banners: Banner[]) {
  try {
    await fetch('/api/banners', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ banners }),
    });
  } catch {}
}

export async function getActiveBanners(): Promise<Banner[]> {
  const banners = await getBanners();
  return banners.filter((b) => b.active);
}

export async function addBanner(banner: Omit<Banner, "id">): Promise<Banner> {
  const banners = await getBanners();
  const newBanner: Banner = { ...banner, id: String(Date.now()) };
  banners.push(newBanner);
  await saveBanners(banners);
  return newBanner;
}

export async function updateBanner(id: string, updates: Partial<Banner>): Promise<Banner | null> {
  const banners = await getBanners();
  const idx = banners.findIndex((b) => b.id === id);
  if (idx === -1) return null;
  banners[idx] = { ...banners[idx], ...updates };
  await saveBanners(banners);
  return banners[idx];
}

export async function deleteBanner(id: string): Promise<boolean> {
  const banners = await getBanners();
  const filtered = banners.filter((b) => b.id !== id);
  if (filtered.length === banners.length) return false;
  await saveBanners(filtered);
  return true;
}

// ── Promo Cards ──

export async function getPromoCards(): Promise<PromoCard[]> {
  // Promo cards use same banner API with type=PROMO
  try {
    const res = await fetch('/api/banners', { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (data.success) {
        const promos = data.data.filter((b: any) => b.type === 'PROMO_CARD');
        if (promos.length > 0) return promos;
      }
    }
  } catch {}
  return defaultPromoCards;
}

export async function savePromoCards(cards: PromoCard[]) {
  try {
    const promoData = cards.map(c => ({ ...c, type: 'PROMO_CARD' }));
    await fetch('/api/banners', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ banners: promoData }),
    });
  } catch {}
}

export async function getActivePromoCards(): Promise<PromoCard[]> {
  const cards = await getPromoCards();
  return cards.filter((c) => c.active);
}

export async function addPromoCard(card: Omit<PromoCard, "id">): Promise<PromoCard> {
  const cards = await getPromoCards();
  const newCard: PromoCard = { ...card, id: String(Date.now()) };
  cards.push(newCard);
  await savePromoCards(cards);
  return newCard;
}

export async function updatePromoCard(id: string, updates: Partial<PromoCard>): Promise<PromoCard | null> {
  const cards = await getPromoCards();
  const idx = cards.findIndex((c) => c.id === id);
  if (idx === -1) return null;
  cards[idx] = { ...cards[idx], ...updates };
  await savePromoCards(cards);
  return cards[idx];
}

export async function deletePromoCard(id: string): Promise<boolean> {
  const cards = await getPromoCards();
  const filtered = cards.filter((c) => c.id !== id);
  if (filtered.length === cards.length) return false;
  await savePromoCards(filtered);
  return true;
}
