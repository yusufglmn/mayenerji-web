"use client";
import { useState, useRef } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";
import { slugify, sayi } from "@/lib/format";
import type { Proje } from "@/lib/types";

const BOS: Partial<Proje> = {
  baslik: "", ozet: "", icerik: "", konum: "", segment: "mesken",
  guc_kwp: null, panel_sayisi: null, tamamlanma: null,
  kapak_url: "", galeri: [], one_cikan: false, yayinda: true, sira: 0,
};

export default function ProjelerIstemci({ baslangic }: { baslangic: Proje[] }) {
  const [liste, setListe] = useState(baslangic);
  const [duzenlenen, setDuzenlenen] = useState<Partial<Proje> | null>(null);
  const [yukleniyor, setYukleniyor] = useState(false);
  const [bildirim, setBildirim] = useState("");
  const kapakRef = useRef<HTMLInputElement>(null);
  const galeriRef = useRef<HTMLInputElement>(null);

  const bildir = (m: string) => { setBildirim(m); setTimeout(() => setBildirim(""), 3500); };

  /** Fotoğrafı Supabase Storage'a yükler, herkese açık URL döner */
  async function fotoYukle(dosya: File): Promise<string | null> {
    const sb = supabaseBrowser();
    const uzanti = dosya.name.split(".").pop()?.toLowerCase() || "jpg";
    const ad = `projeler/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${uzanti}`;
    const { error } = await sb.storage.from("gorseller").upload(ad, dosya, { cacheControl: "31536000", upsert: false });
    if (error) { bildir(`Yükleme hatası: ${error.message}`); return null; }
    return sb.storage.from("gorseller").getPublicUrl(ad).data.publicUrl;
  }

  async function kapakSec(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f || !duzenlenen) return;
    setYukleniyor(true);
    const url = await fotoYukle(f);
    setYukleniyor(false);
    if (url) setDuzenlenen({ ...duzenlenen, kapak_url: url });
    if (kapakRef.current) kapakRef.current.value = "";
  }

  async function galeriSec(e: React.ChangeEvent<HTMLInputElement>) {
    const dosyalar = Array.from(e.target.files ?? []);
    if (!dosyalar.length || !duzenlenen) return;
    setYukleniyor(true);
    const urller: string[] = [];
    for (const d of dosyalar) {
      const u = await fotoYukle(d);
      if (u) urller.push(u);
    }
    setYukleniyor(false);
    setDuzenlenen({ ...duzenlenen, galeri: [...(duzenlenen.galeri ?? []), ...urller] });
    if (galeriRef.current) galeriRef.current.value = "";
    bildir(`${urller.length} fotoğraf yüklendi.`);
  }

  async function kaydet() {
    if (!duzenlenen?.baslik) { bildir("Hata: Başlık zorunlu."); return; }
    setYukleniyor(true);
    const sb = supabaseBrowser();
    const kayit = {
      ...duzenlenen,
      slug: duzenlenen.slug || slugify(duzenlenen.baslik) + "-" + Date.now().toString(36).slice(-4),
      guc_kwp: duzenlenen.guc_kwp ? Number(duzenlenen.guc_kwp) : null,
      panel_sayisi: duzenlenen.panel_sayisi ? Number(duzenlenen.panel_sayisi) : null,
      tamamlanma: duzenlenen.tamamlanma || null,
      galeri: duzenlenen.galeri ?? [],
    };
    const { data, error } = duzenlenen.id
      ? await sb.from("projeler").update(kayit).eq("id", duzenlenen.id).select().single()
      : await sb.from("projeler").insert(kayit).select().single();
    setYukleniyor(false);
    if (error) { bildir(`Hata: ${error.message}`); return; }
    setListe((p) => duzenlenen.id ? p.map((x) => x.id === data.id ? data : x) : [data, ...p]);
    setDuzenlenen(null);
    bildir("Proje kaydedildi ve sitede yayınlandı.");
  }

  async function sil(id: number) {
    if (!confirm("Bu proje kalıcı olarak silinecek. Emin misiniz?")) return;
    const { error } = await supabaseBrowser().from("projeler").delete().eq("id", id);
    if (error) { bildir(`Hata: ${error.message}`); return; }
    setListe((p) => p.filter((x) => x.id !== id));
    bildir("Proje silindi.");
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-lacivert">Projeler ve Fotoğraflar</h1>
          <p className="mt-1.5 text-sm text-slate-600">
            Tamamladığınız kurulumları fotoğraflarıyla yayınlayın. Eklediğiniz an sitede görünür.
          </p>
        </div>
        {!duzenlenen && (
          <button onClick={() => setDuzenlenen({ ...BOS })} className="btn-birincil">+ Yeni proje ekle</button>
        )}
      </div>

      {bildirim && (
        <p className={`rounded-xl px-5 py-3.5 text-sm font-semibold ${
          bildirim.startsWith("Hata") ? "bg-red-50 text-red-700" : "bg-yesil-100 text-yesil-700"}`}>
          {bildirim}
        </p>
      )}

      {/* ---------- FORM ---------- */}
      {duzenlenen && (
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="font-bold text-lacivert">{duzenlenen.id ? "Projeyi düzenle" : "Yeni proje"}</h2>

          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            <div>
              <label className="etiket-form">Proje başlığı *</label>
              <input value={duzenlenen.baslik ?? ""} className="girdi"
                placeholder="örn. Defne'de 10 kWp müstakil ev çatı GES"
                onChange={(e) => setDuzenlenen({ ...duzenlenen, baslik: e.target.value })} />
            </div>
            <div>
              <label className="etiket-form">Konum</label>
              <input value={duzenlenen.konum ?? ""} className="girdi" placeholder="örn. Defne / Hatay"
                onChange={(e) => setDuzenlenen({ ...duzenlenen, konum: e.target.value })} />
            </div>
          </div>

          <div className="mt-5">
            <label className="etiket-form">Kısa özet (kartta görünür)</label>
            <textarea rows={2} value={duzenlenen.ozet ?? ""} className="girdi resize-none"
              placeholder="Müşterinin aylık faturasını 4.800 ₺'den 380 ₺'ye düşüren kiremit çatı kurulumu."
              onChange={(e) => setDuzenlenen({ ...duzenlenen, ozet: e.target.value })} />
          </div>

          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="etiket-form">Segment</label>
              <select value={duzenlenen.segment ?? "mesken"} className="girdi"
                onChange={(e) => setDuzenlenen({ ...duzenlenen, segment: e.target.value })}>
                <option value="mesken">Konut</option>
                <option value="ticarethane">İş Yeri</option>
                <option value="sanayi">Sanayi</option>
                <option value="tarimsal">Tarımsal</option>
              </select>
            </div>
            <div>
              <label className="etiket-form">Kurulu güç (kWp)</label>
              <input type="number" step="0.01" value={duzenlenen.guc_kwp ?? ""} className="girdi" placeholder="9.92"
                onChange={(e) => setDuzenlenen({ ...duzenlenen, guc_kwp: e.target.value ? Number(e.target.value) : null })} />
            </div>
            <div>
              <label className="etiket-form">Panel sayısı</label>
              <input type="number" value={duzenlenen.panel_sayisi ?? ""} className="girdi" placeholder="16"
                onChange={(e) => setDuzenlenen({ ...duzenlenen, panel_sayisi: e.target.value ? Number(e.target.value) : null })} />
            </div>
            <div>
              <label className="etiket-form">Tamamlanma tarihi</label>
              <input type="date" value={duzenlenen.tamamlanma ?? ""} className="girdi"
                onChange={(e) => setDuzenlenen({ ...duzenlenen, tamamlanma: e.target.value })} />
            </div>
          </div>

          <div className="mt-5">
            <label className="etiket-form">Detaylı açıklama</label>
            <textarea rows={4} value={duzenlenen.icerik ?? ""} className="girdi resize-none"
              placeholder="Projenin hikayesi, karşılaşılan zorluklar, kullanılan panel ve inverter markası…"
              onChange={(e) => setDuzenlenen({ ...duzenlenen, icerik: e.target.value })} />
          </div>

          {/* Kapak fotoğrafı */}
          <div className="mt-7 rounded-2xl bg-slate-50 p-5">
            <label className="etiket-form">Kapak fotoğrafı</label>
            {duzenlenen.kapak_url && (
              <div className="relative mb-3 inline-block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={duzenlenen.kapak_url} alt="Kapak" className="h-40 w-64 rounded-xl object-cover shadow-sm" />
                <button onClick={() => setDuzenlenen({ ...duzenlenen, kapak_url: "" })}
                  className="absolute -right-2 -top-2 h-7 w-7 rounded-full bg-red-600 text-sm font-bold text-white shadow">×</button>
              </div>
            )}
            <input ref={kapakRef} type="file" accept="image/*" onChange={kapakSec} disabled={yukleniyor}
              className="block w-full text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-lacivert file:px-4 file:py-2.5 file:text-sm file:font-semibold file:text-white hover:file:bg-lacivert-900" />
          </div>

          {/* Galeri */}
          <div className="mt-5 rounded-2xl bg-slate-50 p-5">
            <label className="etiket-form">Galeri fotoğrafları (birden fazla seçebilirsiniz)</label>
            {(duzenlenen.galeri?.length ?? 0) > 0 && (
              <div className="mb-3 flex flex-wrap gap-3">
                {duzenlenen.galeri!.map((g, i) => (
                  <div key={i} className="relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={g} alt={`Galeri ${i + 1}`} className="h-24 w-24 rounded-lg object-cover shadow-sm" />
                    <button onClick={() => setDuzenlenen({ ...duzenlenen, galeri: duzenlenen.galeri!.filter((_, j) => j !== i) })}
                      className="absolute -right-2 -top-2 h-6 w-6 rounded-full bg-red-600 text-xs font-bold text-white shadow">×</button>
                  </div>
                ))}
              </div>
            )}
            <input ref={galeriRef} type="file" accept="image/*" multiple onChange={galeriSec} disabled={yukleniyor}
              className="block w-full text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-lacivert file:px-4 file:py-2.5 file:text-sm file:font-semibold file:text-white hover:file:bg-lacivert-900" />
            {yukleniyor && <p className="mt-2 text-sm font-semibold text-yesil">Yükleniyor…</p>}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-6">
            <label className="flex items-center gap-2.5 text-sm font-semibold text-lacivert">
              <input type="checkbox" checked={duzenlenen.yayinda ?? true} className="h-5 w-5 accent-green-700"
                onChange={(e) => setDuzenlenen({ ...duzenlenen, yayinda: e.target.checked })} />
              Sitede yayınla
            </label>
            <label className="flex items-center gap-2.5 text-sm font-semibold text-lacivert">
              <input type="checkbox" checked={duzenlenen.one_cikan ?? false} className="h-5 w-5 accent-green-700"
                onChange={(e) => setDuzenlenen({ ...duzenlenen, one_cikan: e.target.checked })} />
              Ana sayfada öne çıkar
            </label>
            <div className="flex items-center gap-2.5">
              <span className="text-sm font-semibold text-lacivert">Sıra</span>
              <input type="number" value={duzenlenen.sira ?? 0} className="girdi !w-20 !py-2 !text-sm"
                onChange={(e) => setDuzenlenen({ ...duzenlenen, sira: Number(e.target.value) })} />
            </div>
          </div>

          <div className="mt-7 flex flex-wrap gap-3">
            <button onClick={kaydet} disabled={yukleniyor} className="btn-birincil disabled:opacity-60">
              {yukleniyor ? "Kaydediliyor…" : duzenlenen.id ? "Değişiklikleri kaydet" : "Projeyi yayınla"}
            </button>
            <button onClick={() => setDuzenlenen(null)} className="btn-cerceve">Vazgeç</button>
          </div>
        </div>
      )}

      {/* ---------- LİSTE ---------- */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {liste.length === 0 && !duzenlenen && (
          <p className="col-span-full rounded-2xl bg-white px-6 py-14 text-center text-sm text-slate-500 shadow-sm">
            Henüz proje eklemediniz. &quot;Yeni proje ekle&quot; ile başlayın.
          </p>
        )}
        {liste.map((p) => (
          <div key={p.id} className="overflow-hidden rounded-2xl bg-white shadow-sm">
            {p.kapak_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={p.kapak_url} alt={p.baslik} className="h-40 w-full object-cover" />
            ) : (
              <div className="flex h-40 items-center justify-center bg-slate-100 text-sm text-slate-400">Fotoğraf yok</div>
            )}
            <div className="p-5">
              <div className="flex flex-wrap gap-1.5">
                <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                  p.yayinda ? "bg-yesil-100 text-yesil-700" : "bg-slate-200 text-slate-500"}`}>
                  {p.yayinda ? "Yayında" : "Taslak"}
                </span>
                {p.one_cikan && <span className="rounded-full bg-gunes-100 px-2.5 py-0.5 text-[10px] font-bold uppercase text-gunes-600">Öne çıkan</span>}
              </div>
              <h3 className="mt-2.5 font-bold text-lacivert">{p.baslik}</h3>
              <p className="mt-1 text-xs text-slate-500">
                {p.konum} {p.guc_kwp ? `· ${sayi(p.guc_kwp, 2)} kWp` : ""} {p.galeri?.length ? `· ${p.galeri.length} foto` : ""}
              </p>
              <div className="mt-4 flex gap-2">
                <button onClick={() => setDuzenlenen(p)} className="flex-1 rounded-lg bg-lacivert px-3 py-2 text-xs font-bold text-white hover:bg-lacivert-900">
                  Düzenle
                </button>
                <button onClick={() => sil(p.id)} className="rounded-lg bg-red-50 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-100">
                  Sil
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
