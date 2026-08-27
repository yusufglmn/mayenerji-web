export const tl = (n: number, kesir = 0) =>
  new Intl.NumberFormat("tr-TR", { maximumFractionDigits: kesir, minimumFractionDigits: kesir }).format(
    Math.round(n * 10 ** kesir) / 10 ** kesir
  ) + " ₺";

export const sayi = (n: number, kesir = 0) =>
  new Intl.NumberFormat("tr-TR", { maximumFractionDigits: kesir, minimumFractionDigits: kesir }).format(n);

export const tarih = (s: string | null) =>
  s ? new Date(s).toLocaleDateString("tr-TR", { day: "2-digit", month: "long", year: "numeric" }) : "";

export const tarihSaat = (s: string) =>
  new Date(s).toLocaleString("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });

export const slugify = (s: string) =>
  s.toLowerCase()
    .replaceAll("ı", "i").replaceAll("ğ", "g").replaceAll("ü", "u")
    .replaceAll("ş", "s").replaceAll("ö", "o").replaceAll("ç", "c")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
