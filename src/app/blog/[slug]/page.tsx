import BlogClient from "./BlogClient";

export const dynamic = "force-dynamic";

export default async function BlogPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <BlogClient slug={slug} />;
}
