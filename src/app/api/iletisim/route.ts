import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { mailGonder, satir, tablo } from "@/lib/mail";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const b = await req.json();
    if (!b.ad_soyad || !b.telefon || !b.mesaj) {
      return NextResponse.json({ hata: "Zorunlu alanları doldurun." }, { status: 400 });
    }

    const kayit = {
      ad_soyad: String(b.ad_soyad).slice(0, 120),
      telefon: String(b.telefon).slice(0, 40),
      eposta: String(b.eposta ?? "").slice(0, 120),
      konu: String(b.konu ?? "").slice(0, 120),
      mesaj: String(b.mesaj).slice(0, 4000),
    };

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (url && key) {
      const sb = createClient(url, key);
      const { error } = await sb.from("mesajlar").insert(kayit);
      if (error) console.error("Mesaj kaydedilemedi:", error.message);
    }

    await mailGonder(
      `Yeni iletişim mesajı — ${kayit.ad_soyad}`,
      `<h2 style="font-family:system-ui;color:#12355B">Web sitesinden yeni mesaj</h2>` +
        tablo(
          satir("Ad Soyad", kayit.ad_soyad) + satir("Telefon", kayit.telefon) +
          satir("E-posta", kayit.eposta) + satir("Konu", kayit.konu) +
          satir("Mesaj", kayit.mesaj.replace(/\n/g, "<br>"))
        ),
      kayit.eposta || undefined
    );

    return NextResponse.json({ tamam: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ hata: "Beklenmeyen bir hata oluştu." }, { status: 500 });
  }
}
