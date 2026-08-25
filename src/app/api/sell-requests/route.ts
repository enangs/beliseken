import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// POST /api/sell-requests - Create new sell request
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      category,
      subcategory,
      brand,
      model,
      photos,
      condition,
      functionalCondition,
      damageDescription,
      askingPrice,
      wantOffer,
      whatsapp,
      location,
      userId,
    } = body;

    // Validate required fields
    if (!category || !brand || !model || !condition || !whatsapp || !location) {
      return NextResponse.json(
        { success: false, error: "Mohon lengkapi semua field yang wajib diisi" },
        { status: 400 }
      );
    }

    // Create sell request
    const sellRequest = await prisma.sellRequest.create({
      data: {
        category,
        subcategory: subcategory || null,
        brand,
        model,
        photos: photos || [],
        condition,
        functionalCondition: functionalCondition || "Semua Berfungsi",
        damageDescription: damageDescription || null,
        askingPrice: askingPrice ? BigInt(askingPrice) : null,
        wantOffer: wantOffer || false,
        whatsapp,
        location,
        userId: userId || null,
        status: "PENDING",
      },
    });

    // Generate WhatsApp message for admin notification
    const adminMessage = encodeURIComponent(
      `🔔 *JUAL BARANG BARU!*\n\n` +
      `📦 *${brand} ${model}*\n` +
      `📂 Kategori: ${category}\n` +
      `💫 Kondisi: ${condition}\n` +
      `💰 Harga: ${wantOffer ? "Minta Penawaran" : `Rp ${askingPrice?.toLocaleString("id-ID")}`}\n` +
      `📱 WA: ${whatsapp}\n` +
      `📍 Lokasi: ${location}\n\n` +
      `ID: ${sellRequest.id}`
    );

    // Admin WhatsApp number (from storeInfo)
    const adminWhatsapp = "6285101256123"; // 0851-0125-6123

    return NextResponse.json({
      success: true,
      data: {
        id: sellRequest.id,
        whatsappLink: `https://wa.me/${adminWhatsapp}?text=${adminMessage}`,
      },
      message: "Permintaan jual barang berhasil dikirim! Tim kami akan menghubungi Anda dalam 1 jam via WhatsApp.",
    });
  } catch (error: any) {
    console.error("Error creating sell request:", error?.message, error?.code, error?.meta);
    return NextResponse.json(
      { success: false, error: `Gagal menyimpan: ${error?.message || "Unknown error"}` },
      { status: 500 }
    );
  }
}

// GET /api/sell-requests - List all sell requests (admin only)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const where: any = {};

    if (status && status !== "ALL") {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { brand: { contains: search, mode: "insensitive" } },
        { model: { contains: search, mode: "insensitive" } },
        { whatsapp: { contains: search } },
        { location: { contains: search, mode: "insensitive" } },
      ];
    }

    const sellRequests = await prisma.sellRequest.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    // Parse askingPrice BigInt
    const parsed = sellRequests.map((sr) => ({
      ...sr,
      photos: Array.isArray(sr.photos) ? sr.photos : [],
      askingPrice: sr.askingPrice ? Number(sr.askingPrice) : null,
      offeredPrice: sr.offeredPrice ? Number(sr.offeredPrice) : null,
    }));

    return NextResponse.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error("Error fetching sell requests:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengambil data" },
      { status: 500 }
    );
  }
}

// PUT /api/sell-requests - Update sell request status (admin)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status, adminNotes, offeredPrice } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID tidak valid" },
        { status: 400 }
      );
    }

    const updateData: any = {};

    if (status) updateData.status = status;
    if (adminNotes !== undefined) updateData.adminNotes = adminNotes;
    if (offeredPrice !== undefined) updateData.offeredPrice = BigInt(offeredPrice);

    const updated = await prisma.sellRequest.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    console.error("Error updating sell request:", error);
    return NextResponse.json(
      { success: false, error: "Gagal update data" },
      { status: 500 }
    );
  }
}
