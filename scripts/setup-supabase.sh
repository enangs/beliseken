#!/bin/bash
# ══════════════════════════════════════════════════════════════
# BeliSeken.com — Supabase Setup Script
# Run this after creating a Supabase project
# ══════════════════════════════════════════════════════════════

echo "🚀 BeliSeken.com — Supabase Setup"
echo "─────────────────────────────────────"

# Check if DATABASE_URL is set
if [ -z "$1" ]; then
  echo "❌ Usage: ./setup-supabase.sh <DATABASE_URL>"
  echo ""
  echo "Steps to get DATABASE_URL:"
  echo "1. Go to https://supabase.com"
  echo "2. Create new project"
  echo "3. Go to Settings → Database"
  echo "4. Copy Connection string → URI"
  echo "5. Run: ./setup-supabase.sh 'postgresql://postgres:xxx@xxx.supabase.co:5432/postgres'"
  exit 1
fi

DATABASE_URL=$1

echo "📦 Step 1: Install dependencies..."
npm install

echo ""
echo "🔧 Step 2: Generate Prisma Client..."
npx prisma generate

echo ""
echo "🗄️ Step 3: Run migrations..."
DATABASE_URL="$DATABASE_URL" npx prisma migrate deploy

echo ""
echo "🌱 Step 4: Seed database..."
DATABASE_URL="$DATABASE_URL" npm run db:seed

echo ""
echo "📦 Step 5: Migrate products..."
DATABASE_URL="$DATABASE_URL" npx tsx prisma/migrate-products.ts

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Add DATABASE_URL to GitHub Secrets"
echo "2. Push to GitHub to trigger deployment"
echo "3. Test at https://beliseken.com"
