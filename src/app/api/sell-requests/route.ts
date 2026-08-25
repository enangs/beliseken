import { NextRequest, NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";

// POST /api/sell-requests - Create new sell request
export async function POST(request: NextRequest) {
  const prisma = getPrisma();
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

    console.log("📦 POST /api/sell-requests:", { category, brand, model, whatsapp });

    // Validate required fields
    if (!category || !brand || !model || !condition || !whatsapp || !location) {
      return NextResponse.json(
        { success: false, error: "Mohon lengkapi semua field yang wajib diisi" },
        { status: 400 }
      );
    }

    // Generate ID
    const id = `sr-${Date.now()}-${Math.random().toString(36).substr(2, 8)}`;
    const now = new Date().toISOString();
    const photosJson = JSON.stringify(photos || []);

    // Use raw SQL to insert
    await prisma.$executeRawUnsafe(
      `INSERT INTO sell_requests (
        id, category, subcategory, brand, model, photos,
        condition, functional_condition, damage_description,
        asking_price, want_offer, whatsapp, location, user_id,
        status, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6::jsonb, $7, $8, $9, $10, $11, $12, $13, $14, 'PENDING', $15::timestamp, $16::timestamp)`,
      id, category, subcategory || null, brand, model, photosJson,
      condition, functionalCondition || "Semua Berfungsi", damageDescription || null,
      askingPrice ? askingPrice.toString() : null, wantOffer || false, whatsapp, location, userId || null,
      now, now
    );

    console.log("✅ Sell request created:", id);

    // Generate WhatsApp message for admin notification
    const adminMessage = encodeURIComponent(
      `🔔 *JUAL BARANG BARU!*\n\n` +
      `📦 *${brand} ${model}*\n` +
      `📂 Kategori: ${category}\n` +
      `💫 Kondisi: ${condition}\n` +
      `💰 Harga: ${wantOffer ? "Minta Penawaran" : `Rp ${askingPrice?.toLocaleString("id-ID")}`}\n` +
      `📱 WA: ${whatsapp}\n` +
      `📍 Lokasi: ${location}\n\n` +
      `ID: ${id}`
    );

    // Admin WhatsApp number
    const adminWhatsapp = "6285101256123";

    return NextResponse.json({
      success: true,
      data: {
        id,
        whatsappLink: `https://wa.me/${adminWhatsapp}?text=${adminMessage}`,
      },
      message: "Permintaan jual barang berhasil dikirim!",
    });
  } catch (error: any) {
    console.error("❌ Error creating sell request:", error?.message, error?.code, error?.meta);
    return NextResponse.json(
      { success: false, error: `Gagal menyimpan: ${error?.message || "Unknown error"}` },
      { status: 500 }
    );
  }
}

// GET /api/sell-requests - List all sell requests
export async function GET(request: NextRequest) {
  const prisma = getPrisma();
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    let query = "SELECT * FROM sell_requests";
    const conditions: string[] = [];
    const params: any[] = [];

    if (status && status !== "ALL") {
      conditions.push(`status = $${params.length + 1}`);
      params.push(status);
    }

    if (search) {
      conditions.push(`(brand ILIKE $${params.length + 1} OR model ILIKE $${params.length + 1} OR whatsapp LIKE $${params.length + 1} OR location ILIKE $${params.length + 1})`);
      params.push(`%${search}%`);
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(" AND ")}`;
    }

    query += " ORDER BY created_at DESC";

    const sellRequests = await prisma.$queryRawUnsafe(query, ...params) as any[];

    // Parse data
    const parsed = sellRequests.map((sr: any) => ({
      ...sr,
      photos: typeof sr.photos === "string" ? JSON.parse(sr.photos) : (sr.photos || []),
      asking_price: sr.asking_price ? Number(sr.asking_price) : null,
      offered_price: sr.offered_price ? Number(sr.offered_price) : null,
    }));

    return NextResponse.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error("Error fetching sell requests:", error?.message);
    return NextResponse.json(
      { success: false, error: "Gagal mengambil data" },
      { status: 500 }
    );
  }
}

// PUT /api/sell-requests - Update sell request status
export async function PUT(request: NextRequest) {
  const prisma = getPrisma();
  try {
    const body = await request.json();
    const { id, status, adminNotes, offeredPrice } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID tidak valid" },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();
    const updates: string[] = ["updated_at = NOW()"];
    const params: any[] = [];

    if (status) {
      updates.push(`status = $${params.length + 1}`);
      params.push(status);
    }
    if (adminNotes !== undefined) {
      updates.push(`admin_notes = $${params.length + 1}`);
      params.push(adminNotes);
    }
    if (offeredPrice !== undefined) {
      updates.push(`offered_price = $${params.length + 1}`);
      params.push(offeredPrice);
    }

    params.push(id);
    await prisma.$executeRawUnsafe(
      `UPDATE sell_requests SET ${updates.join(", ")} WHERE id = $${params.length}`,
      ...params
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error updating sell request:", error?.message);
    return NextResponse.json(
      { success: false, error: "Gagal update data" },
      { status: 500 }
    );
  }
}
