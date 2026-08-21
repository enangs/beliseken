import { initialProducts } from "@/data/products";
import ProductClient from "./ProductClient";

export function generateStaticParams() {
  return initialProducts.map((p) => ({ slug: p.slug }));
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ProductClient slug={slug} />;
}
