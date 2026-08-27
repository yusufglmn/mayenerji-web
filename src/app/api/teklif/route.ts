import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { mailGonder, satir, tablo } from "@/lib/mail";

export const runtime = "nodejs";

const trl = (n: number) =>
  new Intl.NumberFormat("tr-TR", { maximumFractionDigits: 0 }).format(n) + " ₺";

export async function POST(req: Request) {
  try {
    const b = await req.json();
    if (!b.ad_soyad || !b.telefon) {
      return NextResponse.json({ hata: "Ad ve telefon zorunludur." }, { status: 400 });
    }

    const kayit = {
      ad_soyad: String(b.ad_soyad).slice(0, 120),
      telefon: String(b.telefon).slice(0, 40),
      eposta: String(b.eposta ?? "").slice(0, 120),
      il: String(b.il ?? "").slice(0, 60),
      segment: String(b.segment ?? "").slice(0, 60),
      not_metni: String(b.not_metni ?? "").slice(0, 2000),
      girdi: b.girdi ?? {},
      sonuc: b.sonuc ?? {},
      durum: "yeni",
    };

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (url && key) {
      const sb = createClient(url, key);
      const { error } = await sb.from("talepler").insert(kayit);
      if (error) console.error("Talep kaydedilemedi:", error.message);
    }

    const s = kayit.sonuc as Record<string, number>;
    await mailGonder(
      `🔆 Yeni teklif talebi — ${kayit.ad_soyad} (${kayit.segment})`,
      `<h2 style="font-family:system-ui;color:#12355B">Hesaplayıcıdan yeni teklif talebi</h2>` +
        tablo(
          satir("Ad Soyad", kayit.ad_soyad) + satir("Telefon", kayit.telefon) +
          satir("E-posta", kayit.eposta) + satir("İl", kayit.il) +
          satir("Segment", kayit.segment) + satir("Notu", kayit.not_metni) +
          satir("<b>— HESAPLAMA —</b>", "") +
          satir("Aylık tüketim", `${Math.round(s.aylikKwh ?? 0)} kWh`) +
          satir("Önerilen güç", `${s.onerilenKwp ?? 0} kWp`) +
          satir("Panel sayısı", `${s.panelSayisi ?? 0} adet`) +
          satir("Tahmini maliyet", `${trl(s.maliyetAltTl ?? 0)} – ${trl(s.maliyetUstTl ?? 0)}`) +
          satir("Yıllık tasarruf", trl(s.yillikTasarrufTl ?? 0)) +
          satir("Amortisman", `${s.amortismanYil ?? 0} yıl`)
        ),
      kayit.eposta || undefined
    );

    return NextResponse.json({ tamam: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ hata: "Beklenmeyen bir hata oluştu." }, { status: 500 });
  }
}
