import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButon from "@/components/WhatsAppButon";
import { ayarlariGetir } from "@/lib/data";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://mayenerjiyazilim.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: "MAY Enerji ve Yazılım | Hatay Güneş Enerji Sistemleri (GES) Kurulumu",
    template: "%s | MAY Enerji ve Yazılım",
  },
  description:
    "Hatay ve çevresinde ev, iş yeri, sanayi ve tarımsal alanlar için anahtar teslim güneş enerji sistemleri (GES) kurulumu, satışı ve bakımı. Ücretsiz keşif ve online fiyat hesaplama.",
  keywords: [
    "Hatay güneş enerjisi", "Hatay GES", "Defne güneş paneli", "çatı GES",
    "tarımsal sulama GES", "güneş enerji sistemleri", "solar panel Hatay",
    "MAY Enerji", "Antakya güneş enerjisi", "elektrik faturası düşürme",
  ],
  authors: [{ name: "MAY Enerji ve Yazılım" }],
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: SITE,
    siteName: "MAY Enerji ve Yazılım",
    title: "MAY Enerji ve Yazılım | Hatay Güneş Enerji Sistemleri",
    description:
      "Ev, iş yeri, sanayi ve tarımsal alanlara anahtar teslim GES kurulumu. Online fiyat hesaplama ile dakikalar içinde tahmini maliyetinizi öğrenin.",
    images: [{ url: "/logo.jpeg", width: 640, height: 640, alt: "MAY Enerji ve Yazılım" }],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: SITE },
};

export const viewport: Viewport = { themeColor: "#12355B", width: "device-width", initialScale: 1 };

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const ayar = await ayarlariGetir();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: ayar.firma_adi,
    image: `${SITE}/logo.jpeg`,
    "@id": SITE,
    url: SITE,
    telephone: ayar.telefon,
    email: ayar.eposta,
    address: {
      "@type": "PostalAddress",
      streetAddress: ayar.adres,
      addressLocality: "Defne",
      addressRegion: "Hatay",
      addressCountry: "TR",
    },
    description:
      "Ev, iş yeri, sanayi ve tarımsal alanlar için güneş enerji sistemleri (GES) montajı, kurulumu ve satışı.",
    areaServed: ["Hatay", "Adana", "Osmaniye", "Gaziantep", "Kilis", "Mersin"],
  };

  return (
    <html lang="tr">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Header ayar={ayar} />
        <main className="min-h-screen">{children}</main>
        <Footer ayar={ayar} />
        <WhatsAppButon numara={ayar.whatsapp} />
      </body>
    </html>
  );
}
