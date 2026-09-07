import type { Metadata } from "next";
import { initialProducts } from "@/data/products";
import ProductClient from "./ProductClient";

export function generateStaticParams() {
  return initialProducts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  
  // Try to find product in local data first
  const product = initialProducts.find((p) => p.slug === slug);
  
  if (!product) {
    return {
      title: "Produk Tidak Ditemukan | BeliSeken",
      description: "Produk yang Anda cari tidak tersedia.",
    };
  }

  const title = `${product.name} | BeliSeken`;
  const description = product.description || `${product.name} - ${product.condition} - Harga ${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(product.price)}`;
  const imageUrl = product.imageBase64 || product.image || "https://beliseken.com/og-default.jpg";
  const url = `https://beliseken.com/product/${slug}`;

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
          alt: product.name,
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
    other: {
      "whatsapp:image": imageUrl,
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ProductClient slug={slug} />;
}
