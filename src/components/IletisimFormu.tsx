"use client";
import { useState } from "react";
import { Ikon } from "./Ikon";

export default function IletisimFormu() {
  const [durum, setDurum] = useState<"bos" | "gonderiliyor" | "tamam" | "hata">("bos");
  const [hata, setHata] = useState("");

  async function gonder(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Form elemanını await ÖNCESİNDE yakala: React, olay işleyicisi bittikten sonra
    // e.currentTarget'ı null yapar; await sonrası ona dokunmak hataya yol açar.
    const form = e.currentTarget;
    setDurum("gonderiliyor");
    const veri = Object.fromEntries(new FormData(form).entries());

    try {
      const r = await fetch("/api/iletisim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(veri),
      });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(j.hata || "Mesaj gönderilemedi.");
      form.reset();
      setDurum("tamam");
    } catch (err) {
      setHata(err instanceof Error ? err.message : "Bir hata oluştu.");
      setDurum("hata");
    }
  }

  if (durum === "tamam") {
    return (
      <div className="mt-8 rounded-2xl bg-yesil-100 p-8 text-center">
        <Ikon ad="onay" className="mx-auto h-12 w-12 text-yesil" />
        <h3 className="mt-4 text-lg font-bold text-yesil-700">Mesajınız bize ulaştı</h3>
        <p className="mt-2 text-sm text-slate-600">
          En geç bir iş günü içinde size dönüş yapacağız. Teşekkür ederiz.
        </p>
        <button onClick={() => setDurum("bos")} className="btn-cerceve mt-6">Yeni mesaj gönder</button>
      </div>
    );
  }

  return (
    <form onSubmit={gonder} className="mt-7 space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="etiket-form" htmlFor="ad">Ad Soyad *</label>
          <input id="ad" name="ad_soyad" required className="girdi" placeholder="Adınız ve soyadınız" />
        </div>
        <div>
          <label className="etiket-form" htmlFor="tel">Telefon *</label>
          <input id="tel" name="telefon" required type="tel" className="girdi" placeholder="05XX XXX XX XX" />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="etiket-form" htmlFor="mail">E-posta</label>
          <input id="mail" name="eposta" type="email" className="girdi" placeholder="ornek@mail.com" />
        </div>
        <div>
          <label className="etiket-form" htmlFor="konu">Konu</label>
          <select id="konu" name="konu" className="girdi">
            <option>Ücretsiz keşif talebi</option>
            <option>Konut GES hakkında bilgi</option>
            <option>İş yeri / esnaf GES</option>
            <option>Sanayi tesisi GES</option>
            <option>Tarımsal sulama / arazi GES</option>
            <option>Bakım ve arıza</option>
            <option>Bayilik / iş birliği</option>
            <option>Diğer</option>
          </select>
        </div>
      </div>

      <div>
        <label className="etiket-form" htmlFor="mesaj">Mesajınız *</label>
        <textarea id="mesaj" name="mesaj" required rows={5} className="girdi resize-none"
          placeholder="Adresinizi, aylık ortalama faturanızı ve varsa çatı bilginizi yazarsanız daha hızlı dönüş yapabiliriz." />
      </div>

      {durum === "hata" && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{hata}</p>
      )}

      <button type="submit" disabled={durum === "gonderiliyor"} className="btn-birincil w-full !py-4 disabled:opacity-60">
        {durum === "gonderiliyor" ? "Gönderiliyor…" : "Mesajı Gönder"}
      </button>

      <p className="text-xs leading-relaxed text-slate-400">
        Gönderdiğiniz bilgiler yalnızca size dönüş yapmak amacıyla kullanılır, üçüncü kişilerle paylaşılmaz.
      </p>
    </form>
  );
}
