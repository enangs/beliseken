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
  type?: string; // HERO, PROMO_CARD
  icon?: string; // lucide-react icon name
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
  icon?: string; // lucide-react icon name
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

// Cache-busting helper for admin fetches
function cacheBust(url: string): string {
  const sep = url.includes('?') ? '&' : '?';
  return `${url}${sep}_t=${Date.now()}`;
}

// ── Banners (HERO type) ──

export async function getBanners(): Promise<Banner[]> {
  try {
    const res = await fetch(cacheBust('/api/banners?type=HERO'), { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (data.success) return data.data || [];
    }
  } catch {}
  return [];
}

export async function saveBanners(banners: Banner[]) {
  const res = await fetch('/api/banners', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ banners, type: 'HERO' }),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.error || 'Gagal menyimpan banner');
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
  // Re-fetch to get actual DB IDs
  const fresh = await getBanners();
  return fresh[fresh.length - 1] || newBanner;
}

export async function updateBanner(id: string, updates: Partial<Banner>): Promise<Banner | null> {
  try {
    const res = await fetch('/api/banners', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, updates }),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Gagal update banner');
    return { id, ...updates } as Banner;
  } catch (e) {
    console.error('Update banner failed:', e);
    throw e;
  }
}

export async function deleteBanner(id: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/banners?id=${id}`, {
      method: 'DELETE',
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Gagal menghapus banner');
    return true;
  } catch (e) {
    console.error('Delete banner failed:', e);
    throw e;
  }
}

// ── Promo Cards (PROMO_CARD type) ──

export async function getPromoCards(): Promise<PromoCard[]> {
  try {
    const res = await fetch(cacheBust('/api/banners?type=PROMO_CARD'), { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (data.success) return data.data || [];
    }
  } catch {}
  return [];
}

export async function savePromoCards(cards: PromoCard[]) {
  const promoData = cards.map(c => ({ ...c, type: 'PROMO_CARD' }));
  const res = await fetch('/api/banners', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ banners: promoData, type: 'PROMO_CARD' }),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.error || 'Gagal menyimpan promo');
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
  // Re-fetch to get actual DB IDs
  const fresh = await getPromoCards();
  return fresh[fresh.length - 1] || newCard;
}

export async function updatePromoCard(id: string, updates: Partial<PromoCard>): Promise<PromoCard | null> {
  try {
    const res = await fetch('/api/banners', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, updates }),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Gagal update promo');
    return { id, ...updates } as PromoCard;
  } catch (e) {
    console.error('Update promo failed:', e);
    throw e;
  }
}

export async function deletePromoCard(id: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/banners?id=${id}`, {
      method: 'DELETE',
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Gagal menghapus promo');
    return true;
  } catch (e) {
    console.error('Delete promo failed:', e);
    throw e;
  }
}
