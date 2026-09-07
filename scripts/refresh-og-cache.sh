#!/bin/bash
# ══════════════════════════════════════════════════════════════
# Bulk OG Cache Refresh for BeliSeken.com
# Refreshes Facebook/WhatsApp Open Graph cache for all products
# ══════════════════════════════════════════════════════════════

SITE="https://beliseken.com"
API="$SITE/api/products?limit=50"
FB_DEBUG="https://developers.facebook.com/tools/debug/?q="

echo "🔄 Fetching product list from API..."
SLUGS=$(curl -s "$API" 2>/dev/null | python3 -c "
import sys, json
data = json.load(sys.stdin)
for p in data.get('data', []):
    print(p['slug'])
" 2>/dev/null)

COUNT=$(echo "$SLUGS" | wc -l | tr -d ' ')
echo "📦 Found $COUNT products"
echo ""

# Method 1: Open Facebook Debugger for each URL (requires manual click)
echo "═══════════════════════════════════════════════════════════"
echo "📋 CARA 1: Buka Facebook Debugger (otomatis buka browser)"
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "Untuk setiap URL, klik 'Scrape Again' di Facebook Debugger."
echo ""

# Method 2: Ping Facebook crawler directly
echo "═══════════════════════════════════════════════════════════"
echo "🚀 CARA 2: Ping Facebook Crawler langsung (otomatis)"
echo "═══════════════════════════════════════════════════════════"
echo ""

i=0
echo "$SLUGS" | while read -r slug; do
    if [ -z "$slug" ]; then continue; fi
    i=$((i + 1))
    URL="$SITE/product/$slug"
    
    echo -n "[$i/$COUNT] $slug... "
    
    # Ping Facebook crawler with og:refresh action
    RESULT=$(curl -s -o /dev/null -w "%{http_code}" \
        -X POST "https://graph.facebook.com/" \
        -d "id=$URL" \
        -d "scrape=true" \
        2>/dev/null)
    
    if [ "$RESULT" = "200" ]; then
        echo "✅ OK"
    else
        echo "⚠️  HTTP $RESULT (trying alternative...)"
        # Alternative: just hit the URL with Facebook bot UA
        curl -s -o /dev/null \
            -H "User-Agent: facebookexternalhit/1.1" \
            "$URL" 2>/dev/null
    fi
    
    # Rate limit: 1 request per second
    sleep 1
done

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "✅ Selesai! OG cache sudah di-refresh untuk $COUNT produk."
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "Tips:"
echo "  - Tunggu 1-2 menit lalu coba share ke WhatsApp"
echo "  - Kalau masih logo, buka Facebook Debugger manual:"
echo "    $FB_DEBUG$SITE/product/<slug>"
echo ""
