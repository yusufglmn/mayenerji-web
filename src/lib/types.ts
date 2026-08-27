export type Ayar = { anahtar: string; deger: string; aciklama: string };

export type Parametre = {
  anahtar: string; deger: number; birim: string; grup: string;
  etiket: string; aciklama: string; sira: number;
};

export type MaliyetKademesi = {
  id: number; min_kwp: number; max_kwp: number; tl_per_kwp: number; etiket: string; sira: number;
};

export type AboneGrubu = {
  kod: string; ad: string; aciklama: string; elektrik_tl: number;
  kdv_orani: number; ikon: string; sira: number; aktif: boolean;
};

export type Cihaz = {
  id: number; ad: string; guc_w: number; gunluk_saat: number;
  kategori: string; ikon: string; sira: number; aktif: boolean;
};

export type MontajTipi = {
  kod: string; ad: string; m2_per_kwp: number; carpan: number; aciklama: string; sira: number;
};

export type Il = { kod: string; ad: string; verim: number; sira: number };

export type Hizmet = {
  id: number; slug: string; baslik: string; ozet: string; icerik: string;
  ikon: string; gorsel_url: string; sira: number; yayinda: boolean;
};

export type Proje = {
  id: number; slug: string; baslik: string; ozet: string; icerik: string;
  konum: string; segment: string; guc_kwp: number | null; panel_sayisi: number | null;
  tamamlanma: string | null; kapak_url: string; galeri: string[];
  one_cikan: boolean; yayinda: boolean; sira: number; olusturuldu: string;
};

export type Sss = { id: number; soru: string; cevap: string; sira: number; yayinda: boolean };

export type Talep = {
  id: number; ad_soyad: string; telefon: string; eposta: string; il: string;
  segment: string; girdi: Record<string, unknown>; sonuc: Record<string, unknown>;
  not_metni: string; durum: string; olusturuldu: string;
};

export type Mesaj = {
  id: number; ad_soyad: string; telefon: string; eposta: string;
  konu: string; mesaj: string; okundu: boolean; olusturuldu: string;
};

/** Hesaplayıcının ihtiyaç duyduğu tüm parametrelerin tek paketi */
export type HesapVerisi = {
  parametreler: Record<string, number>;
  kademeler: MaliyetKademesi[];
  gruplar: AboneGrubu[];
  cihazlar: Cihaz[];
  montajlar: MontajTipi[];
  iller: Il[];
};

export type HesapGirdisi = {
  segment: string;            // abone grubu kodu
  il: string;                 // il kodu
  yontem: "fatura" | "tuketim" | "cihaz";
  faturaTl?: number;          // aylık ortalama fatura (TL)
  aylikKwh?: number;          // aylık tüketim (kWh)
  cihazlar?: { id: number; adet: number }[];
  montaj: string;             // montaj tipi kodu
  alanM2?: number;            // mevcut çatı/arazi alanı (opsiyonel, sınırlama için)
};

export type HesapSonucu = {
  aylikKwh: number;
  yillikKwh: number;
  gerekliKwp: number;
  onerilenKwp: number;
  panelSayisi: number;
  gerekliAlanM2: number;
  alanKisitliMi: boolean;
  karsilamaOrani: number;      // % — ihtiyacın ne kadarını karşılıyor
  yillikUretimKwh: number;
  maliyetTl: number;
  maliyetAltTl: number;
  maliyetUstTl: number;
  tlPerKwp: number;
  yillikTasarrufTl: number;
  aylikTasarrufTl: number;
  amortismanYil: number;
  yirmiBesYilKazancTl: number;
  yillikCo2Kg: number;
  agacEsdegeri: number;
  elektrikTl: number;
};
