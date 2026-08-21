import { initialBlogPosts } from "@/data/products";
import BlogClient from "./BlogClient";

export function generateStaticParams() {
  return initialBlogPosts.map((p) => ({ slug: p.slug }));
}

export default async function BlogPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <BlogClient slug={slug} />;
}
