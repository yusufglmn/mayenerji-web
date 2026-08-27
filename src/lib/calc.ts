import type { HesapVerisi, HesapGirdisi, HesapSonucu } from "./types";

/**
 * MAY ENERJİ — GES fiyat/fizibilite hesaplama motoru
 *
 * Akış:
 *  1) Kullanıcının aylık tüketimi kWh cinsinden bulunur (fatura / kWh / cihaz listesi)
 *  2) Bölgenin güneşlenme verimi ve sistem kayıpları ile gerekli kurulu güç (kWp) hesaplanır
 *  3) Çatı/arazi alanı varsa kapasite bu alanla sınırlanır
 *  4) Kademeli birim fiyat ile anahtar teslim maliyet ve fiyat aralığı çıkarılır
 *  5) Yıllık tasarruf, amortisman süresi ve 25 yıllık net kazanç hesaplanır
 *
 * Tüm katsayılar veritabanından gelir; yönetim panelinden değiştirilebilir.
 */
export function hesapla(g: HesapGirdisi, v: HesapVerisi): HesapSonucu {
  const p = (k: string, varsayilan: number) =>
    Number.isFinite(v.parametreler[k]) ? v.parametreler[k] : varsayilan;

  const grup = v.gruplar.find((x) => x.kod === g.segment) ?? v.gruplar[0];
  const il = v.iller.find((x) => x.kod === g.il) ?? v.iller[0];
  const montaj = v.montajlar.find((x) => x.kod === g.montaj) ?? v.montajlar[0];

  const elektrikTl = grup?.elektrik_tl ?? 4;
  const brutVerim = il?.verim ?? 1600;          // kWh/kWp/yıl (kayıpsız)
  const kayip = p("sistem_kaybi", 14) / 100;
  const netVerim = brutVerim * (1 - kayip);      // gerçekleşen kWh/kWp/yıl

  // ---------- 1) Aylık tüketim (kWh) ----------
  let aylikKwh = 0;
  if (g.yontem === "tuketim") {
    aylikKwh = Math.max(0, g.aylikKwh ?? 0);
  } else if (g.yontem === "fatura") {
    aylikKwh = Math.max(0, (g.faturaTl ?? 0) / elektrikTl);
  } else {
    const secilen = g.cihazlar ?? [];
    const gunlukWh = secilen.reduce((t, s) => {
      const c = v.cihazlar.find((x) => x.id === s.id);
      if (!c || s.adet <= 0) return t;
      return t + c.guc_w * c.gunluk_saat * s.adet;
    }, 0);
    aylikKwh = (gunlukWh / 1000) * 30.4;
  }

  const yillikKwh = aylikKwh * 12;

  // ---------- 2) Gerekli kurulu güç ----------
  const emniyet = 1 + p("emniyet_payi", 10) / 100;
  const gerekliKwp = netVerim > 0 ? (yillikKwh / netVerim) * emniyet : 0;

  // ---------- 3) Alan kısıtı ----------
  const m2PerKwp = montaj?.m2_per_kwp ?? 5.5;
  const alanKwp = g.alanM2 && g.alanM2 > 0 ? g.alanM2 / m2PerKwp : Infinity;
  const alanKisitliMi = alanKwp < gerekliKwp;
  let onerilenKwp = Math.min(gerekliKwp, alanKwp);

  // Panel adedine yuvarla
  const panelW = p("panel_watt", 620);
  let panelSayisi = Math.max(panelW > 0 ? Math.round((onerilenKwp * 1000) / panelW) : 0, 0);
  if (onerilenKwp > 0 && panelSayisi < 1) panelSayisi = 1;
  onerilenKwp = (panelSayisi * panelW) / 1000;

  const gerekliAlanM2 = onerilenKwp * m2PerKwp;
  const yillikUretimKwh = onerilenKwp * netVerim;
  const karsilamaOrani = yillikKwh > 0 ? Math.min((yillikUretimKwh / yillikKwh) * 100, 100) : 0;

  // ---------- 4) Maliyet ----------
  const kademe =
    [...v.kademeler].sort((a, b) => a.min_kwp - b.min_kwp)
      .find((k) => onerilenKwp >= k.min_kwp && onerilenKwp < k.max_kwp) ??
    v.kademeler[v.kademeler.length - 1];

  const tlPerKwp = (kademe?.tl_per_kwp ?? 28000) * (montaj?.carpan ?? 1);
  const maliyetTl = onerilenKwp * tlPerKwp;
  const maliyetAltTl = maliyetTl * (1 - p("fiyat_alt_sapma", 8) / 100);
  const maliyetUstTl = maliyetTl * (1 + p("fiyat_ust_sapma", 14) / 100);

  // ---------- 5) Tasarruf ve amortisman ----------
  const ozTuketim = p("ozproduksiyon", 92) / 100;   // doğrudan tüketilen kısım
  const mahsup = p("mahsuplasma", 85) / 100;        // şebekeye verilenin karşılık oranı
  const kendiKullanim = Math.min(yillikUretimKwh, yillikKwh) * ozTuketim;
  const fazla = Math.max(0, yillikUretimKwh - kendiKullanim);

  const bakim = maliyetTl * (p("bakim_orani", 0.8) / 100);
  const yillikTasarrufTl = Math.max(
    0,
    (kendiKullanim + fazla * mahsup) * elektrikTl - bakim
  );

  // Amortisman: elektriğin ENFLASYON ÜSTÜ (reel) artışı ve panel bozunması birlikte modellenir.
  // Tüm tutarlar bugünkü TL ile ifade edilir; nominal enflasyon kullanılmaz, aksi halde
  // 25 yıllık toplam anlamsız biçimde şişer.
  const zam = p("elektrik_reel_artis", 3) / 100;
  const bozunma = p("yillik_bozunma", 0.55) / 100;
  let kumulatif = 0;
  let amortismanYil = 0;
  for (let yil = 1; yil <= 30; yil++) {
    const yillik = yillikTasarrufTl * (1 + zam) ** (yil - 1) * (1 - bozunma) ** (yil - 1);
    const onceki = kumulatif;
    kumulatif += yillik;
    if (onceki < maliyetTl && kumulatif >= maliyetTl) {
      amortismanYil = yil - 1 + (maliyetTl - onceki) / yillik;
    }
  }
  if (amortismanYil === 0 && yillikTasarrufTl > 0) amortismanYil = maliyetTl / yillikTasarrufTl;

  // 25 yıllık net kazanç (bugünkü para birimiyle, reel artış dahil)
  let yirmiBes = 0;
  for (let yil = 1; yil <= 25; yil++) {
    yirmiBes += yillikTasarrufTl * (1 + zam) ** (yil - 1) * (1 - bozunma) ** (yil - 1);
  }

  // ---------- 6) Çevresel katkı ----------
  const yillikCo2Kg = yillikUretimKwh * p("co2_katsayi", 0.44);
  const agacEsdegeri = yillikCo2Kg / p("agac_katsayi", 21.8);

  return {
    aylikKwh: r(aylikKwh),
    yillikKwh: r(yillikKwh),
    gerekliKwp: r(gerekliKwp, 2),
    onerilenKwp: r(onerilenKwp, 2),
    panelSayisi,
    gerekliAlanM2: r(gerekliAlanM2),
    alanKisitliMi,
    karsilamaOrani: r(karsilamaOrani),
    yillikUretimKwh: r(yillikUretimKwh),
    maliyetTl: r(maliyetTl),
    maliyetAltTl: r(maliyetAltTl),
    maliyetUstTl: r(maliyetUstTl),
    tlPerKwp: r(tlPerKwp),
    yillikTasarrufTl: r(yillikTasarrufTl),
    aylikTasarrufTl: r(yillikTasarrufTl / 12),
    amortismanYil: r(amortismanYil, 1),
    yirmiBesYilKazancTl: r(yirmiBes),
    yillikCo2Kg: r(yillikCo2Kg),
    agacEsdegeri: Math.round(agacEsdegeri),
    elektrikTl,
  };
}

const r = (n: number, k = 0) =>
  Number.isFinite(n) ? Math.round(n * 10 ** k) / 10 ** k : 0;

/** Veritabanı yokken/erişilemezken kullanılan güvenli varsayılanlar */
export const VARSAYILAN_VERI: HesapVerisi = {
  parametreler: {
    panel_watt: 620, sistem_kaybi: 14, yillik_bozunma: 0.55, emniyet_payi: 10,
    fiyat_alt_sapma: 8, fiyat_ust_sapma: 14, elektrik_reel_artis: 3, bakim_orani: 0.8,
    ozproduksiyon: 92, mahsuplasma: 85, co2_katsayi: 0.44, agac_katsayi: 21.8, sistem_omru: 30,
  },
  kademeler: [
    { id: 1, min_kwp: 0, max_kwp: 10, tl_per_kwp: 31000, etiket: "Konut ölçeği (0–10 kWp)", sira: 1 },
    { id: 2, min_kwp: 10, max_kwp: 30, tl_per_kwp: 27500, etiket: "Büyük konut / esnaf (10–30 kWp)", sira: 2 },
    { id: 3, min_kwp: 30, max_kwp: 100, tl_per_kwp: 24500, etiket: "Ticari (30–100 kWp)", sira: 3 },
    { id: 4, min_kwp: 100, max_kwp: 250, tl_per_kwp: 22500, etiket: "Sanayi (100–250 kWp)", sira: 4 },
    { id: 5, min_kwp: 250, max_kwp: 1000, tl_per_kwp: 21000, etiket: "Büyük sanayi (250 kWp–1 MW)", sira: 5 },
    { id: 6, min_kwp: 1000, max_kwp: 100000, tl_per_kwp: 19500, etiket: "Santral ölçeği (1 MW+)", sira: 6 },
  ],
  gruplar: [
    { kod: "mesken", ad: "Ev / Mesken", aciklama: "Müstakil ev, villa, apartman dairesi ve site ortak alanları", elektrik_tl: 3.85, kdv_orani: 20, ikon: "ev", sira: 1, aktif: true },
    { kod: "ticarethane", ad: "Esnaf / İş Yeri", aciklama: "Dükkan, market, kafe, restoran, ofis, otel, oto yıkama, berber", elektrik_tl: 5.30, kdv_orani: 20, ikon: "dukkan", sira: 2, aktif: true },
    { kod: "sanayi", ad: "Sanayi / İmalat", aciklama: "Fabrika, imalathane, soğuk hava deposu, atölye, un-yem-tekstil tesisleri", elektrik_tl: 4.80, kdv_orani: 20, ikon: "fabrika", sira: 3, aktif: true },
    { kod: "tarimsal", ad: "Tarımsal / Sulama", aciklama: "Tarımsal sulama, sera, besi ve süt çiftliği, damlama sulama, arazi GES", elektrik_tl: 3.95, kdv_orani: 20, ikon: "tarim", sira: 4, aktif: true },
  ],
  montajlar: [
    { kod: "trapez", ad: "Sac / trapez çatı", m2_per_kwp: 4.8, carpan: 1.0, aciklama: "Fabrika, depo, ahır, hangar çatıları", sira: 1 },
    { kod: "kiremit", ad: "Kiremit çatı", m2_per_kwp: 5.6, carpan: 1.06, aciklama: "Müstakil ev ve villa çatıları", sira: 2 },
    { kod: "beton", ad: "Beton / teras çatı", m2_per_kwp: 7.5, carpan: 1.08, aciklama: "Apartman ve düz betonarme çatılar", sira: 3 },
    { kod: "arazi", ad: "Arazi / tarla", m2_per_kwp: 12.0, carpan: 1.12, aciklama: "Boş arazi üzerine konstrüksiyonlu", sira: 4 },
    { kod: "sundurma", ad: "Sundurma / otopark", m2_per_kwp: 6.5, carpan: 1.22, aciklama: "Carport, sera üstü, gölgelik yapılar", sira: 5 },
  ],
  iller: [
    { kod: "hatay", ad: "Hatay", verim: 1720, sira: 1 },
    { kod: "adana", ad: "Adana", verim: 1730, sira: 2 },
    { kod: "osmaniye", ad: "Osmaniye", verim: 1700, sira: 3 },
    { kod: "mersin", ad: "Mersin", verim: 1735, sira: 4 },
    { kod: "gaziantep", ad: "Gaziantep", verim: 1740, sira: 5 },
    { kod: "kilis", ad: "Kilis", verim: 1760, sira: 6 },
    { kod: "sanliurfa", ad: "Şanlıurfa", verim: 1790, sira: 7 },
    { kod: "kahramanmaras", ad: "Kahramanmaraş", verim: 1710, sira: 8 },
    { kod: "antalya", ad: "Antalya", verim: 1740, sira: 9 },
    { kod: "konya", ad: "Konya", verim: 1750, sira: 10 },
    { kod: "ankara", ad: "Ankara", verim: 1620, sira: 11 },
    { kod: "izmir", ad: "İzmir", verim: 1660, sira: 12 },
    { kod: "istanbul", ad: "İstanbul", verim: 1450, sira: 13 },
    { kod: "diger", ad: "Diğer iller", verim: 1600, sira: 99 },
  ],
  cihazlar: [],
};
