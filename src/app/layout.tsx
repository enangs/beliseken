import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Beli Elektronik Bekas Berkualitas | Laptop, HP, Monitor — BeliSeken.com",
    template: "%s | BeliSeken.com",
  },
  description:
    "BeliSeken.com — Jual beli elektronik bekas premium di Bekasi. Laptop, HP, monitor, router berkualitas dengan garansi 30 hari. Hemat hingga 70%! Gratis jemput barang Bekasi. Hubungi: 0851-0125-6123.",
  keywords: [
    "beli elektronik bekas",
    "jual beli laptop bekas",
    "elektronik bekas berkualitas",
    "laptop bekas murah",
    "hp bekas",
    "monitor bekas",
    "toko elektronik bekas bekasi",
  ],
  authors: [{ name: "BeliSeken.com" }],
  creator: "BeliSeken.com",
  metadataBase: new URL("https://beliseken.com"),
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://beliseken.com",
    siteName: "BeliSeken.com",
    title: "Beli Elektronik Bekas Berkualitas | BeliSeken.com",
    description:
      "Laptop, HP, monitor, router berkualitas dengan garansi 30 hari. Hemat hingga 70% dari harga baru!",
    images: [
      {
        url: "/hero.webp",
        width: 1200,
        height: 630,
        alt: "BeliSeken.com — Jual Beli Elektronik Bekas Premium",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Beli Elektronik Bekas Berkualitas | BeliSeken.com",
    description:
      "Laptop, HP, monitor, router berkualitas dengan garansi 30 hari. Hemat hingga 70%!",
    images: ["/hero.webp"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${inter.variable} h-full antialiased`}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#e94560" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="BeliSeken" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" />
        {/* Preload critical resources for LCP */}
        <link rel="preload" href="/hero.webp" as="image" fetchPriority="high" />
        {/* Preconnect to Cloudinary for faster image loads */}
        {/* Facebook Pixel */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '1234567890');
              fbq('track', 'PageView');
            `,
          }}
        />

        {/* Social Media Schema Markup */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "BeliSeken.com",
              "url": "https://beliseken.com",
              "logo": "https://beliseken.com/logo.png",
              "sameAs": [
                "https://www.instagram.com/beliseken1/",
                "https://www.facebook.com/profile.php?id=61593794008221"
              ],
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+6285101256123",
                "contactType": "customer service",
                "availableLanguage": ["Indonesian", "English"]
              },
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Griyaasri 2 Blok H6 No 30, Tambun Selatan",
                "addressLocality": "Bekasi",
                "addressRegion": "Jawa Barat",
                "postalCode": "17510",
                "addressCountry": "ID"
              }
            })
          }}
        />

        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
      </head>
      <body className="min-h-full flex flex-col font-sans pb-20 lg:pb-0">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
