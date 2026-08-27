import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://mayenerjiyazilim.com";
  const yollar = ["", "/hizmetler", "/hesaplama", "/projeler", "/hakkimizda", "/sss", "/iletisim"];
  return yollar.map((y) => ({
    url: `${base}${y}`,
    lastModified: new Date(),
    changeFrequency: y === "" ? "weekly" : "monthly",
    priority: y === "" ? 1 : y === "/hesaplama" ? 0.9 : 0.7,
  }));
}
