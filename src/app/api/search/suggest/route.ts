export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q")?.trim();

    if (!q || q.length < 2) {
      return NextResponse.json({ success: true, data: [] });
    }

    // Find matching products — title, brand, category name
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { brand: { name: { contains: q, mode: "insensitive" } } },
          { category: { name: { contains: q, mode: "insensitive" } } },
        ],
      },
      select: {
        name: true,
        slug: true,
        sellingPrice: true,
        brand: { select: { name: true } },
        category: { select: { name: true } },
        images: {
          where: { isPrimary: true },
          take: 1,
          select: { url: true },
        },
      },
      orderBy: { soldCount: "desc" },
      take: 8,
    });

    const suggestions = products.map((p: any) => ({
      name: p.name,
      slug: p.slug,
      price: p.sellingPrice,
      brand: p.brand?.name || "",
      category: p.category?.name || "",
      image: p.images?.[0]?.url || null,
    }));

    return NextResponse.json({ success: true, data: suggestions });
  } catch (error) {
    console.error("Search suggest error:", error);
    return NextResponse.json(
      { success: false, data: [] },
      { status: 500 }
    );
  }
}
