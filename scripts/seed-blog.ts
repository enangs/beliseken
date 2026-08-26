import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const samplePosts = [
  {
    title: 'Tips Memilih Laptop Bekas yang Berkualitas',
    slug: 'tips-memilih-laptop-bekas-berkualitas',
    excerpt: 'Panduan lengkap memilih laptop bekas impian Anda. Mulai dari cara mengecek kondisi fisik, performa, hingga baterai.',
    content: `<h2>Mengapa Beli Laptop Bekas?</h2>
<p>Membeli laptop bekas bisa menjadi pilihan cerdas untuk mendapatkan spesifikasi tinggi dengan harga terjangkau. Namun, ada beberapa hal penting yang perlu diperhatikan agar tidak kecewa.</p>

<h2>1. Cek Kondisi Fisik</h2>
<p>Pastikan tidak ada goresan dalam, layar tidak ada dead pixel, dan keyboard berfungsi dengan baik. Perhatikan juga port USB, HDMI, dan konektor lainnya.</p>

<h2>2. Test Performa</h2>
<p>Minta penjual untuk menyalakan laptop dan coba beberapa aplikasi berat seperti browser dengan banyak tab, atau aplikasi editing ringan.</p>

<h2>3. Cek Baterai</h2>
<p>Baterai adalah komponen yang paling sering aus. Cek battery health menggunakan software seperti BatteryInfoView. Idealnya di atas 80%.</p>

<h2>4. Garansi</h2>
<p>Pilih toko yang memberikan garansi minimal 30 hari seperti BeliSeken.com. Ini jaminan bahwa barang benar-benar berkualitas.</p>

<h2>Kesimpulan</h2>
<p>Dengan memperhatikan tips di atas, Anda bisa mendaptop bekas berkualitas dengan harga hemat. Kunjungi BeliSeken.com untuk pilihan terbaik!</p>`,
    category: 'Tips & Trik',
    isFeatured: true,
    isPublished: true,
    readTime: '5 menit',
  },
  {
    title: 'Perbedaan Grade A, B, dan C pada Elektronik Bekas',
    slug: 'perbedaan-grade-elektronik-bekas',
    excerpt: 'Kenali sistem grading yang digunakan untuk menilai kondisi elektronik bekas. Grade mana yang cocok untuk Anda?',
    content: `<h2>Sistem Grading Elektronik Bekas</h2>
<p>Di BeliSeken.com, kami menggunakan sistem grading untuk memudahkan Anda memilih produk sesuai kebutuhan dan budget.</p>

<h2>Grade A - Mulus</h2>
<p> kondisi seperti baru, tidak ada goresan, semua fungsi normal. Cocok untuk Anda yang menginginkan kualitas terbaik.</p>

<h2>Grade B - Lecet Pemakaian</h2>
<p>Ada goresan minor dari pemakaian normal, tapi semua fungsi berjalan sempurna. Pilihan terbaik untuk value for money.</p>

<h2>Grade C - Minus Fungsi</h2>
<p>Ada cacat pada fungsi tertentu (misal: touchpad kurang responsif). Harga paling terjangkau, cocok untuk sparepart atau pengguna yang tidak masalah dengan fungsi tertentu.</p>

<h2>Rekomendasi Kami</h2>
<p>Untuk penggunaan sehari-hari, kami rekomendasikan Grade A atau B. Grade C cocok untuk teknisi atau yang ingin berhemat lebih.</p>`,
    category: 'Panduan',
    isFeatured: false,
    isPublished: true,
    readTime: '4 menit',
  },
  {
    title: 'Cara Menjual Barang Elektronik Bekas di BeliSeken',
    slug: 'cara-jual-elektronik-bekas',
    excerpt: 'Ingin menjual elektronik bekas Anda? Ikuti langkah mudah ini untuk mendapatkan harga terbaik.',
    content: `<h2>Jual Barang Bekas? Gampang!</h2>
<p>BeliSeken.com menerima pembelian elektronik bekas Anda dengan harga terbaik. Prosesnya mudah dan transparan.</p>

<h2>Langkah 1: Kirim Foto</h2>
<p>Klik tombol "Jual Barang" di website kami. Upload foto barang dari berbagai sisi. Semakin jelas, semakin akurat penawaran kami.</p>

<h2>Langkah 2: Dapatkan Penawaran</h2>
<p>Tim kami akan meninjau foto Anda dan memberikan penawaran harga dalam 1 jam. Tidak ada kewajiban untuk menerima.</p>

<h2>Langkah 3: Deal & Ambil</h2>
<p>Jika Anda setuju dengan harga, kami akan menjemput barang secara gratis di area Bekasi. Pembayaran langsung ditransfer!</p>

<h2>Kenapa BeliSeken?</h2>
<ul>
<li>Harga transparan dan fair</li>
<li>Gratis jemput barang Bekasi</li>
<li>Pembayaran cepat (1x24 jam)</li>
</ul>`,
    category: 'Jual Barang',
    isFeatured: false,
    isPublished: true,
    readTime: '3 menit',
  },
  {
    title: 'Mengapa Membeli Monitor Bekas untuk Setup WFH?',
    slug: 'monitor-bekas-work-from-home',
    excerpt: 'Monitor bekas bisa jadi solusi cerdas untuk setup work from home yang nyaman tanpa merogoh kocek terlalu dalam.',
    content: `<h2>WFH? Butuh Monitor Ekstra!</h2>
<p>Bekerja dari rumah jadi lebih produktif dengan monitor ekstra. Tapi monitor baru bisa mahal. Solusinya? Monitor bekas berkualitas!</p>

<h2>Keuntungan Monitor Bekas</h2>
<p>Harga monitor bekas bisa 50-70% lebih murah dari baru. Dengan budget yang sama, Anda bisa dapat ukuran lebih besar atau resolusi lebih tinggi.</p>

<h2>Yang Perlu Diperhatikan</h2>
<p>Cek dead pixel, kondisi panel (IPS lebih baik), dan port yang tersedia. Di BeliSeken.com, semua monitor sudah dicek dan digrade kondisinya.</p>

<h2>Rekomendasi Ukuran</h2>
<p>Untuk WFH, minimal 24 inch sudah cukup nyaman. Jika budget lebih, 27 inch dengan resolusi 2K sangat ideal.</p>`,
    category: 'Tips & Trik',
    isFeatured: false,
    isPublished: true,
    readTime: '4 menit',
  },
  {
    title: 'Garansi 30 Hari BeliSeken: Jaminan Kualitas',
    slug: 'garansi-30-hari-beliseken',
    excerpt: 'Kami berani memberikan garansi 30 hari untuk semua produk. Kenapa? Karena kami yakin dengan kualitas barang kami.',
    content: `<h2>Kenapa Garansi Penting?</h2>
<p>Membeli elektronik bekas memang memiliki risiko. Makanya kami memberikan garansi 30 hari untuk semua pembelian di BeliSeken.com.</h2>

<h2>Apa yang Dicover?</h2>
<p>Semua kerusakan yang bukan karena human error. Jika barang rusak dalam 30 hari, Anda bisa retur atau tukar unit.</p>

<h2>Proses Klaim</h2>
<p>Hubungi kami via WhatsApp, kirim foto/video masalah, dan kami akan proses dalam 1x24 jam. Mudah dan tanpa ribet.</p>

<h2>Komitmen Kami</h2>
<p>Garansi ini bukan hanya formalitas. Ini bentuk komitmen kami hanya menjual barang bekas berkualitas premium.</p>`,
    category: 'Informasi',
    isFeatured: false,
    isPublished: true,
    readTime: '3 menit',
  },
];

async function main() {
  console.log('🌱 Seeding blog posts...\n');

  for (const post of samplePosts) {
    try {
      // Check if slug already exists
      const existing = await prisma.blogPost.findUnique({
        where: { slug: post.slug },
      });

      if (existing) {
        console.log(`⏭️  Skipping "${post.title}" (already exists)`);
        continue;
      }

      await prisma.blogPost.create({
        data: {
          id: `blog-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          content: post.content,
          category: post.category,
          isFeatured: post.isFeatured,
          isPublished: post.isPublished,
          publishedAt: new Date(),
        },
      });

      console.log(`✅ Created: "${post.title}"`);
    } catch (error: any) {
      console.error(`❌ Error creating "${post.title}":`, error.message);
    }
  }

  console.log('\n🎉 Blog seeding complete!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
