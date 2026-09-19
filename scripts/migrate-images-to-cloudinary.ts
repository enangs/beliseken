/**
 * Migration Script: Convert base64 images to Cloudinary
 * 
 * Run: npx tsx scripts/migrate-images-to-cloudinary.ts
 * 
 * This script will:
 * 1. Fetch all products with base64 images
 * 2. Upload each image to Cloudinary
 * 3. Update the database with Cloudinary URLs
 * 
 * Requirements:
 * - Set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, NEXT_PUBLIC_CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET in .env
 * - Run: npm install cloudinary
 */

import { PrismaClient } from '@prisma/client';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const prisma = new PrismaClient();

async function migrateImages() {
  console.log('🚀 Starting image migration to Cloudinary...\n');

  // Fetch all products
  const products = await prisma.product.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      images: {
        select: {
          id: true,
          url: true,
          isPrimary: true,
        },
      },
    },
  });

  console.log(`📦 Found ${products.length} products\n`);

  let migrated = 0;
  let skipped = 0;
  let errors = 0;

  for (const product of products) {
    console.log(`\n🔄 Processing: ${product.name} (${product.slug})`);

    // Check if product already has Cloudinary URLs
    const hasCloudinaryUrls = product.images.some(img => 
      img.url.includes('cloudinary.com')
    );

    if (hasCloudinaryUrls) {
      console.log('  ⏭️  Skipping - already has Cloudinary URLs');
      skipped++;
      continue;
    }

    // Check if product has base64 images
    const hasBase64Images = product.images.some(img => 
      img.url.startsWith('data:image')
    );

    if (!hasBase64Images) {
      console.log('  ⏭️  Skipping - no base64 images found');
      skipped++;
      continue;
    }

    // Upload each base64 image to Cloudinary
    for (const image of product.images) {
      if (!image.url.startsWith('data:image')) {
        continue;
      }

      try {
        console.log(`  📤 Uploading image ${image.id}...`);

        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(image.url, {
          folder: 'beliseken/products',
          public_id: `${product.slug}-${image.id}`,
          transformation: [
            { width: 800, height: 600, crop: 'fill', quality: 'auto' }
          ],
        });

        // Update database with Cloudinary URL
        await prisma.productImage.update({
          where: { id: image.id },
          data: { url: result.secure_url },
        });

        console.log(`  ✅ Uploaded: ${result.secure_url}`);
        migrated++;
      } catch (error) {
        console.error(`  ❌ Error uploading image ${image.id}:`, error);
        errors++;
      }
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log('📊 Migration Summary:');
  console.log(`  ✅ Migrated: ${migrated} images`);
  console.log(`  ⏭️  Skipped: ${skipped} products`);
  console.log(`  ❌ Errors: ${errors} images`);
  console.log('='.repeat(50));

  await prisma.$disconnect();
}

// Run migration
migrateImages().catch(console.error);
