import type { Metadata } from "next";
import ProductClient from "./ProductClient";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  
  let title = "Produk | BeliSeken";
  let description = "Beli elektronik bekas berkualitas dengan harga terjangkau.";
  let imageUrl = "https://beliseken.com/og-default.jpg";
  let url = `https://beliseken.com/product/${slug}`;

  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://beliseken.com";
    const res = await fetch(`${baseUrl}/api/products/${slug}`, { cache: "no-store" });
    const data = await res.json();
    
    if (data.success && data.data) {
      const p = data.data;
      title = `${p.name} | BeliSeken`;
      // Short description for OG (max 200 chars for social media)
      const price = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(p.sellingPrice);
      description = `${p.name} ${price} - BeliSeken.com`;
      
      // Use the first product image (Cloudinary URL) for OG image
      if (p.allImages && p.allImages.length > 0 && p.allImages[0]) {
        imageUrl = p.allImages[0];
      } else if (p.imageBase64 && !p.imageBase64.startsWith('data:')) {
        imageUrl = p.imageBase64;
      }
    }
  } catch {}

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: "BeliSeken",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type: "website",
      locale: "id_ID",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ProductClient slug={slug} />;
}
