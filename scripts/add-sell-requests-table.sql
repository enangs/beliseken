-- Sell Requests table
CREATE TABLE IF NOT EXISTS sell_requests (
  id TEXT PRIMARY KEY DEFAULT 'sr-' || extract(epoch from now())::text || '-' || substr(md5(random()::text), 1, 8),
  
  -- Basic Info
  category TEXT NOT NULL,
  subcategory TEXT,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  
  -- Photos (array of Cloudinary URLs)
  photos JSONB DEFAULT '[]',
  
  -- Condition
  condition TEXT NOT NULL,
  functional_condition TEXT NOT NULL DEFAULT 'Semua Berfungsi',
  damage_description TEXT,
  
  -- Pricing
  asking_price BIGINT,
  want_offer BOOLEAN DEFAULT false,
  offered_price BIGINT,
  
  -- Contact
  whatsapp TEXT NOT NULL,
  location TEXT NOT NULL,
  user_id TEXT,
  
  -- Status: PENDING, CONTACTED, NEGOTIATION, ACCEPTED, REJECTED, COMPLETED
  status TEXT DEFAULT 'PENDING',
  
  -- Admin notes
  admin_notes TEXT,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_sell_requests_status ON sell_requests(status);
CREATE INDEX IF NOT EXISTS idx_sell_requests_created ON sell_requests(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sell_requests_whatsapp ON sell_requests(whatsapp);
CREATE INDEX IF NOT EXISTS idx_sell_requests_user ON sell_requests(user_id);

-- Comments
COMMENT ON TABLE sell_requests IS 'Menyimpan permintaan jual barang dari pelanggan';
COMMENT ON COLUMN sell_requests.status IS 'Status: PENDING, CONTACTED, NEGOTIATION, ACCEPTED, REJECTED, COMPLETED';
