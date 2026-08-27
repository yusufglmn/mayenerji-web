import { supabaseServer, supabaseYapilandirildiMi } from "./supabase/server";
import { VARSAYILAN_VERI } from "./calc";
import type { HesapVerisi, Hizmet, Proje, Sss, Cihaz } from "./types";

/** Sunucu tarafında hesaplayıcı verisini toplar. Supabase yoksa varsayılanlara düşer. */
export async function hesapVerisiGetir(): Promise<HesapVerisi> {
  if (!supabaseYapilandirildiMi()) return VARSAYILAN_VERI;
  try {
    const sb = await supabaseServer();
    const [par, kad, grp, chz, mnt, ill] = await Promise.all([
      sb.from("parametreler").select("anahtar,deger"),
      sb.from("maliyet_kademeleri").select("*").order("sira"),
      sb.from("abone_gruplari").select("*").eq("aktif", true).order("sira"),
      sb.from("cihazlar").select("*").eq("aktif", true).order("sira"),
      sb.from("montaj_tipleri").select("*").order("sira"),
      sb.from("iller").select("*").order("sira"),
    ]);

    const parametreler: Record<string, number> = { ...VARSAYILAN_VERI.parametreler };
    (par.data ?? []).forEach((p: { anahtar: string; deger: number }) => {
      parametreler[p.anahtar] = Number(p.deger);
    });

    return {
      parametreler,
      kademeler: kad.data?.length ? kad.data : VARSAYILAN_VERI.kademeler,
      gruplar: grp.data?.length ? grp.data : VARSAYILAN_VERI.gruplar,
      cihazlar: (chz.data ?? []) as Cihaz[],
      montajlar: mnt.data?.length ? mnt.data : VARSAYILAN_VERI.montajlar,
      iller: ill.data?.length ? ill.data : VARSAYILAN_VERI.iller,
    };
  } catch {
    return VARSAYILAN_VERI;
  }
}

const VARSAYILAN_AYAR: Record<string, string> = {
  firma_adi: "MAY Enerji ve Yazılım",
  slogan: "Güneşten kazanın, geleceğe yatırım yapın",
  telefon: "+90 000 000 00 00",
  whatsapp: "900000000000",
  eposta: "info@mayenerjiyazilim.com",
  adres: "Defne / HATAY",
  adres_detay: "Defne, Hatay",
  calisma_saati: "Pazartesi–Cumartesi 09:00–18:00",
  instagram: "", facebook: "", linkedin: "", harita_embed: "",
};

export async function ayarlariGetir(): Promise<Record<string, string>> {
  if (!supabaseYapilandirildiMi()) return VARSAYILAN_AYAR;
  try {
    const sb = await supabaseServer();
    const { data } = await sb.from("ayarlar").select("anahtar,deger");
    const out = { ...VARSAYILAN_AYAR };
    (data ?? []).forEach((a: { anahtar: string; deger: string }) => {
      if (a.deger) out[a.anahtar] = a.deger;
    });
    return out;
  } catch {
    return VARSAYILAN_AYAR;
  }
}

export async function hizmetleriGetir(): Promise<Hizmet[]> {
  if (!supabaseYapilandirildiMi()) return VARSAYILAN_HIZMETLER;
  try {
    const sb = await supabaseServer();
    const { data } = await sb.from("hizmetler").select("*").eq("yayinda", true).order("sira");
    return data?.length ? (data as Hizmet[]) : VARSAYILAN_HIZMETLER;
  } catch { return VARSAYILAN_HIZMETLER; }
}

export async function projeleriGetir(sadeceOneCikan = false): Promise<Proje[]> {
  if (!supabaseYapilandirildiMi()) return [];
  try {
    const sb = await supabaseServer();
    let q = sb.from("projeler").select("*").eq("yayinda", true);
    if (sadeceOneCikan) q = q.eq("one_cikan", true);
    const { data } = await q.order("sira").order("olusturuldu", { ascending: false });
    return (data ?? []) as Proje[];
  } catch { return []; }
}

export async function sssGetir(): Promise<Sss[]> {
  if (!supabaseYapilandirildiMi()) return VARSAYILAN_SSS;
  try {
    const sb = await supabaseServer();
    const { data } = await sb.from("sss").select("*").eq("yayinda", true).order("sira");
    return data?.length ? (data as Sss[]) : VARSAYILAN_SSS;
  } catch { return VARSAYILAN_SSS; }
}

// --- Supabase bağlanana kadar sitenin boş görünmemesi için yedek içerik ---
const VARSAYILAN_HIZMETLER: Hizmet[] = [
  { id: 1, slug: "konut-ges", baslik: "Konut Çatı GES", ozet: "Müstakil ev, villa ve apartmanlar için anahtar teslim çatı güneş enerji sistemleri.", icerik: "Elektrik faturanızın büyük bölümünü sıfırlayan, çatınıza uygun ölçekte tasarlanmış sistemler kuruyoruz. Keşiften devreye almaya, dağıtım şirketi başvurusundan çift yönlü sayaç montajına kadar tüm süreci biz yönetiyoruz.", ikon: "ev", gorsel_url: "", sira: 1, yayinda: true },
  { id: 2, slug: "isyeri-ges", baslik: "İş Yeri ve Esnaf GES", ozet: "Dükkan, market, kafe, otel ve ofisler için gündüz tüketimini karşılayan sistemler.", icerik: "Esnafın en büyük avantajı, elektriği tam da güneşin en çok ürettiği saatlerde tüketiyor olmasıdır. Bu da öz tüketim oranını yükseltir ve amortismanı kısaltır.", ikon: "dukkan", gorsel_url: "", sira: 2, yayinda: true },
  { id: 3, slug: "sanayi-ges", baslik: "Sanayi ve Fabrika GES", ozet: "İmalathane, fabrika ve soğuk hava depoları için yüksek kapasiteli çatı üstü çözümler.", icerik: "Sanayi çatıları geniş, düz ve gölgesizdir; bu da kWp başına en düşük maliyeti mümkün kılar. Trafo kapasitesi analizi ve yük profili çıkarma dahil mühendislik tarafını uçtan uca üstleniyoruz.", ikon: "fabrika", gorsel_url: "", sira: 3, yayinda: true },
  { id: 4, slug: "tarimsal-ges", baslik: "Tarımsal Sulama ve Arazi GES", ozet: "Sulama tesisleri, seralar, besi ve süt çiftlikleri için tarımsal GES kurulumları.", icerik: "Tarımsal sulamada elektrik, işletme giderinin en büyük kalemidir. Güneş enerjisiyle bu gideri neredeyse sıfıra indiriyoruz.", ikon: "tarim", gorsel_url: "", sira: 4, yayinda: true },
  { id: 5, slug: "hibrit-depolama", baslik: "Hibrit Sistem ve Enerji Depolama", ozet: "Kesintiye dayanıklı, akülü hibrit sistemler ve batarya depolama çözümleri.", icerik: "Elektrik kesintilerinin kritik olduğu işletmeler için lityum bataryalı hibrit sistemler kuruyoruz.", ikon: "batarya", gorsel_url: "", sira: 5, yayinda: true },
  { id: 6, slug: "bakim-izleme", baslik: "Bakım, İzleme ve Yazılım", ozet: "Kurduğumuz ve kurmadığımız tüm sistemler için periyodik bakım ve uzaktan izleme.", icerik: "Panel temizliği, termal kamera taraması, inverter kontrolü ve yıllık verim raporu içeren bakım paketleri sunuyoruz.", ikon: "izleme", gorsel_url: "", sira: 6, yayinda: true },
];

const VARSAYILAN_SSS: Sss[] = [
  { id: 1, soru: "Güneş enerjisi sistemi kendini kaç yılda amorti eder?", cevap: "Hatay ve çevresindeki güneşlenme değerleriyle mesken kurulumlarında ortalama 4–6 yıl, ticari ve sanayi kurulumlarında 3–5 yıl, tarımsal sulama tesislerinde 3–4 yıl arasında amortisman süresi görüyoruz. Panellerin garantisi 25–30 yıl olduğu için sonrası net kazançtır.", sira: 1, yayinda: true },
  { id: 2, soru: "Elektriğim kesildiğinde sistem çalışmaya devam eder mi?", cevap: "Şebekeye bağlı (on-grid) sistemler, can güvenliği mevzuatı gereği elektrik kesildiğinde devre dışı kalır. Kesintide de elektrik istiyorsanız akülü hibrit sistem kurmamız gerekir.", sira: 2, yayinda: true },
  { id: 3, soru: "Ürettiğim fazla elektriği ne yapıyorum?", cevap: "Çift yönlü sayaç ile fazla üretiminiz şebekeye verilir ve faturanızdan mahsup edilir. Aylık üretim tüketimi aşarsa aradaki fark YEKDEM birim fiyatı üzerinden hesabınıza ödenir.", sira: 3, yayinda: true },
  { id: 4, soru: "Kurulum için izin ve ruhsat gerekiyor mu?", cevap: "Çatı üstü kurulumlarda 5 MW altı sistemler için lisans gerekmez, ancak dağıtım şirketine bağlantı başvurusu ve proje onayı süreci işletilir. Tüm evrak sürecini biz takip ediyoruz.", sira: 4, yayinda: true },
  { id: 5, soru: "Panellerin bakımı zor mu?", cevap: "Hayır. Hareketli parça yoktur, yılda 1–2 temizlik ve yıllık elektriksel kontrol yeterlidir. Yıllık bakım gideri yatırımın yaklaşık %0,5–1'i kadardır.", sira: 5, yayinda: true },
  { id: 6, soru: "Çatım güneş paneline uygun mu?", cevap: "Güneye, güneydoğuya veya güneybatıya bakan, gölgelenmesi az ve taşıyıcı yapısı sağlam her çatı uygundur. Ücretsiz keşifte çatınızı ölçüp net kapasiteyi söylüyoruz.", sira: 6, yayinda: true },
];
