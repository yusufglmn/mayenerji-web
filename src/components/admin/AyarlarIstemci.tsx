"use client";
import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";
import { slugify } from "@/lib/format";
import type { Ayar, Hizmet, Sss } from "@/lib/types";

export default function AyarlarIstemci({
  ayarlar, hizmetler, sssler,
}: { ayarlar: Ayar[]; hizmetler: Hizmet[]; sssler: Sss[] }) {
  const [sekme, setSekme] = useState<"iletisim" | "hizmet" | "sss">("iletisim");
  const [ayr, setAyr] = useState(ayarlar);
  const [hzm, setHzm] = useState(hizmetler);
  const [sss, setSss] = useState(sssler);
  const [kaydediliyor, setKaydediliyor] = useState(false);
  const [bildirim, setBildirim] = useState("");

  const bildir = (m: string) => { setBildirim(m); setTimeout(() => setBildirim(""), 3500); };

  async function kaydet(tablo: string, satirlar: Record<string, unknown>[], anahtar: string) {
    setKaydediliyor(true);
    const { error } = await supabaseBrowser().from(tablo).upsert(satirlar, { onConflict: anahtar });
    setKaydediliyor(false);
    bildir(error ? `Hata: ${error.message}` : "Kaydedildi. Site anında güncellendi.");
  }

  async function sssSil(id: number) {
    if (!confirm("Bu soru silinsin mi?")) return;
    await supabaseBrowser().from("sss").delete().eq("id", id);
    setSss((p) => p.filter((x) => x.id !== id));
  }

  async function sssEkle() {
    const { data, error } = await supabaseBrowser().from("sss")
      .insert({ soru: "Yeni soru", cevap: "Cevabı buraya yazın.", sira: sss.length + 1, yayinda: true })
      .select().single();
    if (error) { bildir(`Hata: ${error.message}`); return; }
    setSss((p) => [...p, data]);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-lacivert">Site Ayarları ve İçerik</h1>
        <p className="mt-1.5 text-sm text-slate-600">
          İletişim bilgileriniz, hizmet açıklamalarınız ve sıkça sorulan sorular.
        </p>
      </div>

      {bildirim && (
        <p className={`rounded-xl px-5 py-3.5 text-sm font-semibold ${
          bildirim.startsWith("Hata") ? "bg-red-50 text-red-700" : "bg-yesil-100 text-yesil-700"}`}>
          {bildirim}
        </p>
      )}

      <div className="flex flex-wrap gap-2">
        {([["iletisim", "İletişim & Firma"], ["hizmet", "Hizmet Metinleri"], ["sss", "Sıkça Sorulan Sorular"]] as const).map(([k, ad]) => (
          <button key={k} onClick={() => setSekme(k)}
            className={`rounded-xl px-5 py-2.5 text-sm font-bold transition ${
              sekme === k ? "bg-lacivert text-white" : "bg-white text-slate-600 hover:bg-slate-50"}`}>
            {ad}
          </button>
        ))}
      </div>

      {sekme === "iletisim" && (
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="rounded-xl bg-gunes-100 px-5 py-3.5 text-sm text-gunes-600">
            <strong>Önemli:</strong> Telefon ve WhatsApp numaranızı mutlaka gerçek numaranızla değiştirin —
            varsayılan değerler yer tutucudur.
          </p>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            {ayr.map((a) => (
              <div key={a.anahtar} className={a.anahtar === "harita_embed" ? "sm:col-span-2" : ""}>
                <label className="etiket-form !mb-1.5">{a.aciklama || a.anahtar}</label>
                <input value={a.deger} className="girdi !py-2.5 !text-sm"
                  onChange={(e) => setAyr(ayr.map((x) => x.anahtar === a.anahtar ? { ...x, deger: e.target.value } : x))} />
                <p className="mt-1 font-mono text-[10px] text-slate-400">{a.anahtar}</p>
              </div>
            ))}
          </div>
          <button disabled={kaydediliyor}
            onClick={() => kaydet("ayarlar", ayr.map((a) => ({ ...a, guncellendi: new Date().toISOString() })), "anahtar")}
            className="btn-birincil mt-7 disabled:opacity-60">
            {kaydediliyor ? "Kaydediliyor…" : "Ayarları kaydet"}
          </button>
        </div>
      )}

      {sekme === "hizmet" && (
        <div className="space-y-5">
          {hzm.map((h, i) => (
            <div key={h.id} className="rounded-2xl bg-white p-6 shadow-sm">
              <div className="grid gap-4 sm:grid-cols-[2fr_1fr]">
                <div>
                  <label className="etiket-form !mb-1.5">Başlık</label>
                  <input value={h.baslik} className="girdi !py-2.5 !text-sm"
                    onChange={(e) => setHzm(hzm.map((x, j) => j === i ? { ...x, baslik: e.target.value, slug: slugify(e.target.value) } : x))} />
                </div>
                <div>
                  <label className="etiket-form !mb-1.5">İkon</label>
                  <select value={h.ikon} className="girdi !py-2.5 !text-sm"
                    onChange={(e) => setHzm(hzm.map((x, j) => j === i ? { ...x, ikon: e.target.value } : x))}>
                    {["ev", "dukkan", "fabrika", "tarim", "batarya", "izleme", "gunes"].map((k) => <option key={k}>{k}</option>)}
                  </select>
                </div>
              </div>
              <div className="mt-4">
                <label className="etiket-form !mb-1.5">Kısa özet</label>
                <textarea rows={2} value={h.ozet} className="girdi resize-none !py-2.5 !text-sm"
                  onChange={(e) => setHzm(hzm.map((x, j) => j === i ? { ...x, ozet: e.target.value } : x))} />
              </div>
              <div className="mt-4">
                <label className="etiket-form !mb-1.5">Detaylı metin</label>
                <textarea rows={4} value={h.icerik} className="girdi resize-none !py-2.5 !text-sm"
                  onChange={(e) => setHzm(hzm.map((x, j) => j === i ? { ...x, icerik: e.target.value } : x))} />
              </div>
              <label className="mt-4 flex items-center gap-2.5 text-sm font-semibold text-lacivert">
                <input type="checkbox" checked={h.yayinda} className="h-5 w-5 accent-green-700"
                  onChange={(e) => setHzm(hzm.map((x, j) => j === i ? { ...x, yayinda: e.target.checked } : x))} />
                Yayında
              </label>
            </div>
          ))}
          <button disabled={kaydediliyor} onClick={() => kaydet("hizmetler", hzm, "id")}
            className="btn-birincil disabled:opacity-60">
            {kaydediliyor ? "Kaydediliyor…" : "Hizmetleri kaydet"}
          </button>
        </div>
      )}

      {sekme === "sss" && (
        <div className="space-y-4">
          {sss.map((s, i) => (
            <div key={s.id} className="rounded-2xl bg-white p-6 shadow-sm">
              <label className="etiket-form !mb-1.5">Soru</label>
              <input value={s.soru} className="girdi !py-2.5 !text-sm"
                onChange={(e) => setSss(sss.map((x, j) => j === i ? { ...x, soru: e.target.value } : x))} />
              <label className="etiket-form !mb-1.5 mt-4">Cevap</label>
              <textarea rows={4} value={s.cevap} className="girdi resize-none !py-2.5 !text-sm"
                onChange={(e) => setSss(sss.map((x, j) => j === i ? { ...x, cevap: e.target.value } : x))} />
              <div className="mt-4 flex items-center justify-between">
                <label className="flex items-center gap-2.5 text-sm font-semibold text-lacivert">
                  <input type="checkbox" checked={s.yayinda} className="h-5 w-5 accent-green-700"
                    onChange={(e) => setSss(sss.map((x, j) => j === i ? { ...x, yayinda: e.target.checked } : x))} />
                  Yayında
                </label>
                <button onClick={() => sssSil(s.id)} className="rounded-lg bg-red-50 px-3.5 py-2 text-xs font-bold text-red-600 hover:bg-red-100">Sil</button>
              </div>
            </div>
          ))}
          <div className="flex flex-wrap gap-3">
            <button disabled={kaydediliyor} onClick={() => kaydet("sss", sss, "id")} className="btn-birincil disabled:opacity-60">
              {kaydediliyor ? "Kaydediliyor…" : "Soruları kaydet"}
            </button>
            <button onClick={sssEkle} className="btn-cerceve">+ Yeni soru ekle</button>
          </div>
        </div>
      )}
    </div>
  );
}
