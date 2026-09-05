import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const blogArticles = [
  {
    title: "10 Tips Jitu Beli Laptop Bekas Agar Tidak Rugi",
    slug: "tips-beli-laptop-bekas",
    excerpt:
      "Mau beli laptop bekas tapi takut tertipu? Simak 10 tips jitu ini agar Anda mendapatkan laptop bekas berkualitas dengan harga terbaik.",
    category: "Tips & Panduan",
    readTime: "7 menit",
    isFeatured: true,
    isPublished: true,
    content: `<h2>Mengapa Beli Laptop Bekas?</h2>
<p>Laptop bekas bisa menjadi pilihan cerdas untuk Anda yang ingin mendapatkan spesifikasi tinggi dengan harga terjangkau. Di Indonesia, pasar elektronik bekas terus berkembang pesat, terutama untuk kategori laptop dan notebook. Namun, tanpa pengetahuan yang cukup, Anda bisa saja mendapatkan produk yang bermasalah.</p>

<h2>10 Tips Beli Laptop Bekas</h2>

<h3>1. Tentukan Kebutuhan Anda</h3>
<p>Sebelum mulai mencari, tentukan dulu untuk apa laptop akan digunakan. Untuk kerja ringan seperti office dan browsing, Anda tidak perlu laptop gaming dengan spesifikasi tinggi. Dengan mengetahui kebutuhan, Anda bisa menyesuaikan budget dan spesifikasi yang dicari.</p>

<h3>2. Cek Kondisi Fisik</h3>
<p>Perhatikan kondisi fisik laptop secara detail. Cek apakah ada lecet, retak, atau bekas jatuh pada bodi. Pastikan semua port USB, HDMI, dan charging berfungsi dengan baik. Jangan ragu untuk mengetes semua fitur fisik sebelum membeli.</p>

<h3>3. Periksa Layar</h3>
<p>Layar adalah komponen paling mahal untuk diganti. Cek apakah ada dead pixel, bercak, atau warna yang tidak merata. Buka website dengan latar belakang putih dan gelap untuk mendeteksi masalah layar. Pastikan juga kecerahan bisa diatur dengan baik.</p>

<h3>4. Test Keyboard dan Touchpad</h3>
<p>Ketik di semua tombol keyboard untuk memastikan setiap tombol berfungsi. Periksa juga touchpad untuk responsivitas dan gesture. Keyboard yang rusak bisa menghabiskan biaya perbaikan yang cukup besar.</p>

<h3>5. Cek Performa Hardware</h3>
<p>Buka Task Manager (Windows) atau Activity Monitor (Mac) untuk melihat penggunaan CPU dan RAM. Jalankan beberapa aplikasi sekaligus untuk menguji performa multitasking. Pastikan tidak ada overheating atau fan yang bermasalah.</p>

<h3>6. Periksa Baterai</h3>
<p>Baterai adalah komponen yang paling cepat aus. Cek health baterai menggunakan software seperti BatteryInfoView (Windows) atau coconutBattery (Mac). Idealnya, baterai masih memiliki kapasitas minimal 70% dari kapasitas aslinya.</p>

<h3>7. Verifikasi Status Garansi</h3>
<p>Meskipun bekas, beberapa laptop masih memiliki sisa garansi dari manufacturer. Cek nomor serial di website resmi manufacturer untuk memastikan status garansi. Garansi menjadi nilai tambah yang signifikan.</p>

<h3>8. Pilih Seller Terpercaya</h3>
<p>Beli dari seller yang memiliki reputasi baik dan menyediakan garansi toko. Di BeliSeken.com, setiap produk melalui inspeksi ketat dan mendapat garansi 30 hari. Ini memberikan keamanan ekstra untuk pembeli.</p>

<h3>9. Bandingkan Harga</h3>
<p>Jangan terburu-buru membeli. Bandingkan harga dari beberapa seller untuk mendapatkan penawaran terbaik. Ingat bahwa harga terlalu murah bisa jadi tanda ada masalah tersembunyi pada produk.</p>

<h3>10. Minta Grading Kondisi</h3>
<p>Tanya grading kondisi produk. Di BeliSeken.com, kami menggunakan sistem grading A+, A, B+, dan B untuk menilai kondisi setiap unit. Ini membantu Anda memahami kondisi produk secara transparan sebelum membeli.</p>

<h2>Rekomendasi Laptop Bekas Berkualitas</h2>
<p>Beberapa merk laptop yang umumnya memiliki daya tahan baik meskipun bekas antara lain Lenovo ThinkPad, ASUS, dan Dell. Laptop-laptop ini dikenal dengan build quality yang baik dan mudah diperbaiki.</p>

<h2>Kesimpulan</h2>
<p>Membeli laptop bekas tidak harus berisiko tinggi. Dengan mengikuti tips-tips di atas, Anda bisa mendapatkan laptop berkualitas dengan harga yang jauh lebih terjangkau. Kunjungi <strong>BeliSeken.com</strong> untuk melihat koleksi laptop bekas berkualitas dengan garansi 30 hari.</p>`,
  },
  {
    title: "Cara Cek Kondisi HP Second Sebelum Membeli",
    slug: "cara-cek-kondisi-hp-second",
    excerpt:
      "Jangan sampai tertipu! Pelajari cara mengecek kondisi HP bekas secara lengkap agar Anda mendapatkan unit yang berkualitas.",
    category: "Tips & Panduan",
    readTime: "6 menit",
    isFeatured: true,
    isPublished: true,
    content: `<h2>Pentingnya Mengecek HP Second</h2>
<p>Membeli HP bekas (second) bisa menghemat hingga 50-70% dari harga baru. Namun, risiko mendapat unit bermasalah juga cukup tinggi jika tidak teliti. Berikut panduan lengkap mengecek kondisi HP second sebelum membeli.</p>

<h2>Panduan Lengkap Cek HP Second</h2>

<h3>1. Cek IMEI dan Status Keaslian</h3>
<p>Ketik <strong>*#06#</strong> di dial pad untuk melihat nomor IMEI. Pastikan nomor IMEI sesuai dengan yang tertera di kotak atau body HP. Anda bisa mengecek status IMEI di website Kementerian Perindustrian untuk memastikan HP tidak terdaftar sebagai barang ilegal.</p>

<h3>2. Cek Layar (LCD/OLED)</h3>
<p>Buka aplikasi atau website dengan latar belakang putih, merah, hijau, dan biru secara bergantian. Perhatikan apakah ada dead pixel (titik mati), bercak, atau warna yang tidak merata. Pastikan juga touch screen berfungsi di seluruh area layar.</p>

<h3>3. Test Semua Tombol Fisik</h3>
<p>Tekan semua tombol fisik: power, volume up/down, dan tombol lainnya. Pastikan setiap tombol memberikan respons yang baik dan tidak ada yang macet atau terlalu keras.</p>

<h3>4. Periksa Kamera</h3>
<p>Buka aplikasi kamera dan test kamera depan serta belakang. Perhatikan apakah gambar jernih, tidak ada bercak, dan autofocus berfungsi dengan baik. Test juga fitur flash jika tersedia.</p>

<h3>5. Cek Baterai</h3>
<p>Di Android, buka Settings > Battery untuk melihat health baterai. Di iPhone, buka Settings > Battery > Battery Health. Idealnya, kapasitas baterai masih di atas 80%. Baterai yang sudah lemah akan membuat HP cepat mati meskipun persentase masih tinggi.</p>

<h3>6. Test konektivitas</h3>
<p>Pastikan WiFi, Bluetooth, dan GPS berfungsi dengan baik. Coba sambungkan ke jaringan WiFi dan test kecepatan internet. Untuk Bluetooth, coba sambungkan ke speaker atau headset wireless.</p>

<h3>7. Cek Sensor</h3>
<p>Test sensor proximity (saat menelepon, layar harus mati saat didekatkan ke telinga), sensor accelerometer (putar HP, layar harus ikut berputar), dan sensor fingerprint jika tersedia.</p>

<h3>8. Periksa Storage dan RAM</h3>
<p>Pastikan kapasitas storage sesuai dengan yang diiklankan. Gunakan aplikasi seperti AIDA64 untuk melihat detail hardware. Hindari HP yang storage-nya sudah terisi lebih dari 80% karena bisa jadi tanda masalah.</p>

<h3>9. Cek Status Lock</h3>
<p>Pastikan HP tidak dalam keadaan terkunci (locked) atau terikat operator tertentu. Reset HP ke pengaturan pabrik di hadapan penjual untuk memastikan tidak ada akun Google atau Apple ID yang masih terkunci.</p>

<h2>Rekomendasi Tempat Beli HP Second</h2>
<p>Pilih seller yang memberikan garansi dan memiliki reputasi baik. Di BeliSeken.com, setiap HP bekas melalui inspeksi 20+ titik dan mendapat garansi 30 hari. Kami juga menyediakan grading kondisi (A+, A, B+, B) sehingga Anda tahu persis kondisi produk.</p>

<h2>Kesimpulan</h2>
<p>Dengan mengikuti panduan di atas, Anda bisa meminimalkan risiko saat membeli HP second. Yang terpenting adalah teliti dan jangan terburu-buru. Kunjungi <strong>BeliSeken.com</strong> untuk koleksi HP bekas berkualitas dengan garansi resmi.</p>`,
  },
  {
    title:
      "Perbedaan Grade A+, A, B+, dan B pada Elektronik Bekas",
    slug: "grading-kondisi-elektronik-bekas",
    excerpt:
      "Apa itu grading A+, A, B+, dan B? Pelajari perbedaan kondisi elektronik bekas agar Anda bisa memilih sesuai kebutuhan dan budget.",
    category: "Informasi",
    readTime: "5 menit",
    isFeatured: false,
    isPublished: true,
    content: `<h2>Memahami Sistem Grading Elektronik Bekas</h2>
<p>Saat membeli elektronik bekas, Anda mungkin sering melihat istilah seperti Grade A+, Grade A, Grade B+, dan Grade B. Sistem grading ini membantu pembeli memahami kondisi produk secara transparan sebelum membeli. Di BeliSeken.com, kami menerapkan sistem grading yang ketat untuk setiap produk.</p>

<h2>Penjelasan Setiap Grade</h2>

<h3>Grade A+ (Like New)</h3>
<p>Grade A+ adalah kondisi terbaik untuk produk bekas. Kondisi ini hampir tidak ada bedanya dengan produk baru:</p>
<ul>
<li>Bodi mulus tanpa lecet atau goresan</li>
<li>Layar bersih tanpa dead pixel</li>
<li>Semua fitur berfungsi sempurna</li>
<li>Baterai masih dalam kondisi sangat baik (di atas 85%)</li>
<li>Aksesoris lengkap (kotak, charger, buku panduan)</li>
</ul>
<p>Cocok untuk: Pembeli yang menginginkan kondisi terbaik dengan harga lebih terjangkau dari baru.</p>

<h3>Grade A (Excellent)</h3>
<p>Grade A masih dalam kondisi sangat baik dengan sedikit tanda penggunaan:</p>
<ul>
<li>Bodi mulus dengan lecet sangat halus (tidak terlihat dari jarak normal)</li>
<li>Layar bersih tanpa masalah</li>
<li>Semua fitur berfungsi dengan baik</li>
<li>Baterai dalam kondisi baik (di atas 75%)</li>
<li>Aksesoris mungkin tidak lengkap (tanpa kotak)</li>
</ul>
<p>Cocok untuk: Pembeli yang mengutamakan fungsionalitas tanpa masalah.</p>

<h3>Grade B+ (Good)</h3>
<p>Grade B+ menunjukkan produk yang masih berfungsi dengan baik namun memiliki tanda penggunaan yang jelas:</p>
<ul>
<li>Bodi memiliki lecet atau goresan yang terlihat</li>
<li>Layar masih bersih dan berfungsi baik</li>
<li>Semua fitur utama berfungsi</li>
<li>Baterai masih cukup baik (di atas 65%)</li>
<li>Aksesoris terbatas (hanya charger)</li>
</ul>
<p>Cocok untuk: Pembeli yang mengutamakan harga terjangkau dengan fungsionalitas penuh.</p>

<h3>Grade B (Fair)</h3>
<p>Grade B adalah kondisi yang masih layak pakai dengan beberapa catatan:</p>
<ul>
<li>Bodi memiliki lecet atau goresan yang cukup jelas</li>
<li>Layar masih berfungsi baik meskipun mungkin ada goresan halus</li>
<li>Fitur utama berfungsi, beberapa fitur mungkin terbatas</li>
<li>Baterai masih cukup (di atas 55%)</li>
<li>Aksesoris terbatas</li>
</ul>
<p>Cocok untuk: Pembeli dengan budget terbatas yang membutuhkan perangkat untuk penggunaan dasar.</p>

<h2>Perbandingan Harga</h2>
<p>Semakin tinggi grade, semakin tinggi pula harganya. Sebagai gambaran umum:</p>
<ul>
<li><strong>Grade A+</strong>: 80-90% dari harga baru</li>
<li><strong>Grade A</strong>: 70-80% dari harga baru</li>
<li><strong>Grade B+</strong>: 55-70% dari harga baru</li>
<li><strong>Grade B</strong>: 40-55% dari harga baru</li>
</ul>

<h2>Tips Memilih Grade yang Tepat</h3>
<p>Pilih grade sesuai kebutuhan Anda. Jika untuk hadiah atau penggunaan formal, pilih Grade A+ atau A. Jika untuk penggunaan pribadi sehari-hari, Grade B+ sudah sangat memadai. Yang terpenting adalah membeli dari seller terpercaya yang memberikan garansi.</p>

<h2>Kesimpulan</h2>
<p>Sistem grading membantu Anda membuat keputusan yang tepat saat membeli elektronik bekas. Di BeliSeken.com, setiap produk telah melalui inspeksi ketat dan mendapat grading yang akurat. Kunjungi <strong>BeliSeken.com</strong> untuk melihat koleksi lengkap kami dengan berbagai pilihan grade.</p>`,
  },
];

async function main() {
  console.log("Seeding blog articles...\n");

  for (const article of blogArticles) {
    try {
      const existing = await prisma.blogPost.findUnique({
        where: { slug: article.slug },
      });

      if (existing) {
        console.log(`⏭️  Skipping (exists): ${article.title}`);
        continue;
      }

      const post = await prisma.blogPost.create({
        data: {
          title: article.title,
          slug: article.slug,
          excerpt: article.excerpt,
          content: article.content,
          category: article.category,
          readTime: article.readTime,
          isFeatured: article.isFeatured,
          isPublished: article.isPublished,
          publishedAt: new Date(),
        },
      });

      console.log(`✅ Created: ${article.title} (${post.id})`);
    } catch (error: any) {
      console.error(`❌ Failed: ${article.title} — ${error.message}`);
    }
  }

  console.log("\nDone!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
