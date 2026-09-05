import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://beliseken.com";

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
    { url: `${baseUrl}/products`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/category/laptop-notebook`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/category/smartphone-tablet`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/category/monitor-tv`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/category/networking-it`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/category/peripheral-aksesoris`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/sell`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/warranty`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
    { url: `${baseUrl}/shipping-returns`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
    { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
  ];

  // Dynamic product pages
  let productPages: MetadataRoute.Sitemap = [];
  try {
    const products = await prisma.product.findMany({
      where: { status: "AVAILABLE" },
      select: { slug: true, updatedAt: true },
      orderBy: { updatedAt: "desc" },
    });
    productPages = products.map((p) => ({
      url: `${baseUrl}/product/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));
  } catch {
    // If DB not available, return static pages only
  }

  // Dynamic blog pages
  let blogPages: MetadataRoute.Sitemap = [];
  try {
    const posts = await prisma.blogPost.findMany({
      where: { isPublished: true },
      select: { slug: true, updatedAt: true, publishedAt: true },
      orderBy: { publishedAt: "desc" },
    });
    blogPages = posts.map((p) => ({
      url: `${baseUrl}/blog/${p.slug}`,
      lastModified: p.updatedAt || p.publishedAt || new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));
  } catch {
    // If DB not available, skip blog pages
  }

  return [...staticPages, ...productPages, ...blogPages];
}
