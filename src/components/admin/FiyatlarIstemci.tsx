"use client";
import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";
import type { Parametre, MaliyetKademesi, AboneGrubu, MontajTipi, Il } from "@/lib/types";

const GRUP_AD: Record<string, string> = {
  teknik: "Teknik katsayılar", fiyat: "Fiyat ve tasarruf katsayıları", cevre: "Çevresel katsayılar", genel: "Genel",
};

export default function FiyatlarIstemci({
  parametreler, kademeler, gruplar, montajlar, iller,
}: {
  parametreler: Parametre[]; kademeler: MaliyetKademesi[];
  gruplar: AboneGrubu[]; montajlar: MontajTipi[]; iller: Il[];
}) {
  const [sekme, setSekme] = useState<"kademe" | "grup" | "parametre" | "montaj" | "il">("kademe");
  const [par, setPar] = useState(parametreler);
  const [kad, setKad] = useState(kademeler);
  const [grp, setGrp] = useState(gruplar);
  const [mnt, setMnt] = useState(montajlar);
  const [ill, setIll] = useState(iller);
  const [kaydediliyor, setKaydediliyor] = useState(false);
  const [bildirim, setBildirim] = useState("");

  const bildir = (m: string) => { setBildirim(m); setTimeout(() => setBildirim(""), 3500); };

  async function kaydet(tablo: string, satirlar: Record<string, unknown>[], anahtar: string) {
    setKaydediliyor(true);
    const sb = supabaseBrowser();
    const { error } = await sb.from(tablo).upsert(satirlar, { onConflict: anahtar });
    setKaydediliyor(false);
    bildir(error ? `Hata: ${error.message}` : "Kaydedildi. Site anında güncellendi.");
  }

  const gruplanmis = par.reduce<Record<string, Parametre[]>>((a, p) => {
    (a[p.grup] ||= []).push(p); return a;
  }, {});

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-lacivert">Fiyat ve Hesaplama Ayarları</h1>
        <p className="mt-1.5 text-sm text-slate-600">
          Buradaki değerler sitedeki fiyat hesaplayıcıyı doğrudan besler. Kaydettiğiniz anda site güncellenir.
        </p>
      </div>

      {bildirim && (
        <p className={`rounded-xl px-5 py-3.5 text-sm font-semibold ${
          bildirim.startsWith("Hata") ? "bg-red-50 text-red-700" : "bg-yesil-100 text-yesil-700"}`}>
          {bildirim}
        </p>
      )}

      <div className="flex flex-wrap gap-2">
        {([
          ["kademe", "kWp Birim Fiyatları"], ["grup", "Elektrik Tarifeleri"],
          ["parametre", "Teknik Katsayılar"], ["montaj", "Montaj Tipleri"], ["il", "İl Verimleri"],
        ] as const).map(([k, ad]) => (
          <button key={k} onClick={() => setSekme(k)}
            className={`rounded-xl px-5 py-2.5 text-sm font-bold transition ${
              sekme === k ? "bg-lacivert text-white" : "bg-white text-slate-600 hover:bg-slate-50"}`}>
            {ad}
          </button>
        ))}
      </div>

      {/* ---------- KADEMELER ---------- */}
      {sekme === "kademe" && (
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="font-bold text-lacivert">Kurulum birim fiyatları (kWp başına)</h2>
          <p className="mt-1.5 text-sm text-slate-600">
            Sistem büyüdükçe kWp maliyeti düşer. Anahtar teslim, KDV ve montaj dahil fiyat girin.
            <strong className="text-lacivert"> Piyasa değiştikçe burayı güncelleyin — en sık dokunacağınız yer burasıdır.</strong>
          </p>
          <div className="mt-6 overflow-x-auto">
            <table className="tablo">
              <thead><tr><th>Kademe adı</th><th>Min kWp</th><th>Max kWp</th><th>TL / kWp</th></tr></thead>
              <tbody>
                {kad.map((k, i) => (
                  <tr key={k.id}>
                    <td>
                      <input value={k.etiket} className="girdi !py-2 !text-sm"
                        onChange={(e) => setKad(kad.map((x, j) => j === i ? { ...x, etiket: e.target.value } : x))} />
                    </td>
                    <td>
                      <input type="number" value={k.min_kwp} className="girdi !w-28 !py-2 !text-sm"
                        onChange={(e) => setKad(kad.map((x, j) => j === i ? { ...x, min_kwp: Number(e.target.value) } : x))} />
                    </td>
                    <td>
                      <input type="number" value={k.max_kwp} className="girdi !w-28 !py-2 !text-sm"
                        onChange={(e) => setKad(kad.map((x, j) => j === i ? { ...x, max_kwp: Number(e.target.value) } : x))} />
                    </td>
                    <td>
                      <input type="number" value={k.tl_per_kwp} className="girdi !w-36 !py-2 !text-sm font-bold"
                        onChange={(e) => setKad(kad.map((x, j) => j === i ? { ...x, tl_per_kwp: Number(e.target.value) } : x))} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button disabled={kaydediliyor} onClick={() => kaydet("maliyet_kademeleri", kad, "id")}
            className="btn-birincil mt-6 disabled:opacity-60">
            {kaydediliyor ? "Kaydediliyor…" : "Birim fiyatları kaydet"}
          </button>
        </div>
      )}

      {/* ---------- ABONE GRUPLARI ---------- */}
      {sekme === "grup" && (
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="font-bold text-lacivert">Elektrik birim fiyatları (abone grubuna göre)</h2>
          <p className="mt-1.5 text-sm text-slate-600">
            Vergiler dahil efektif TL/kWh girin. Bu değer hem faturadan tüketim çıkarmakta hem de
            tasarruf hesabında kullanılır. EPDK tarifesi değiştiğinde güncelleyin.
          </p>
          <div className="mt-6 overflow-x-auto">
            <table className="tablo">
              <thead><tr><th>Kod</th><th>Görünen ad</th><th>Açıklama</th><th>TL/kWh</th><th>Aktif</th></tr></thead>
              <tbody>
                {grp.map((g, i) => (
                  <tr key={g.kod}>
                    <td className="text-xs font-mono text-slate-500">{g.kod}</td>
                    <td>
                      <input value={g.ad} className="girdi !py-2 !text-sm"
                        onChange={(e) => setGrp(grp.map((x, j) => j === i ? { ...x, ad: e.target.value } : x))} />
                    </td>
                    <td>
                      <input value={g.aciklama} className="girdi !py-2 !text-sm !min-w-[280px]"
                        onChange={(e) => setGrp(grp.map((x, j) => j === i ? { ...x, aciklama: e.target.value } : x))} />
                    </td>
                    <td>
                      <input type="number" step="0.01" value={g.elektrik_tl} className="girdi !w-28 !py-2 !text-sm font-bold"
                        onChange={(e) => setGrp(grp.map((x, j) => j === i ? { ...x, elektrik_tl: Number(e.target.value) } : x))} />
                    </td>
                    <td className="text-center">
                      <input type="checkbox" checked={g.aktif} className="h-5 w-5 accent-green-700"
                        onChange={(e) => setGrp(grp.map((x, j) => j === i ? { ...x, aktif: e.target.checked } : x))} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button disabled={kaydediliyor} onClick={() => kaydet("abone_gruplari", grp, "kod")}
            className="btn-birincil mt-6 disabled:opacity-60">
            {kaydediliyor ? "Kaydediliyor…" : "Tarifeleri kaydet"}
          </button>
        </div>
      )}

      {/* ---------- PARAMETRELER ---------- */}
      {sekme === "parametre" && (
        <div className="space-y-5">
          {Object.entries(gruplanmis).map(([g, liste]) => (
            <div key={g} className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="font-bold text-lacivert">{GRUP_AD[g] ?? g}</h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {liste.map((p) => (
                  <div key={p.anahtar}>
                    <label className="etiket-form !mb-1.5">{p.etiket}</label>
                    <div className="relative">
                      <input type="number" step="0.01" value={p.deger} className="girdi !py-2.5 !text-sm pr-14"
                        onChange={(e) => setPar(par.map((x) => x.anahtar === p.anahtar ? { ...x, deger: Number(e.target.value) } : x))} />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">{p.birim}</span>
                    </div>
                    <p className="mt-1.5 text-[11px] leading-relaxed text-slate-500">{p.aciklama}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <button disabled={kaydediliyor}
            onClick={() => kaydet("parametreler", par.map((p) => ({ ...p, guncellendi: new Date().toISOString() })), "anahtar")}
            className="btn-birincil disabled:opacity-60">
            {kaydediliyor ? "Kaydediliyor…" : "Katsayıları kaydet"}
          </button>
        </div>
      )}

      {/* ---------- MONTAJ ---------- */}
      {sekme === "montaj" && (
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="font-bold text-lacivert">Montaj tipleri</h2>
          <p className="mt-1.5 text-sm text-slate-600">
            m²/kWp gereken alanı, çarpan ise konstrüksiyon maliyet farkını belirler (1,00 = ek maliyet yok).
          </p>
          <div className="mt-6 overflow-x-auto">
            <table className="tablo">
              <thead><tr><th>Ad</th><th>Açıklama</th><th>m² / kWp</th><th>Maliyet çarpanı</th></tr></thead>
              <tbody>
                {mnt.map((m, i) => (
                  <tr key={m.kod}>
                    <td>
                      <input value={m.ad} className="girdi !py-2 !text-sm"
                        onChange={(e) => setMnt(mnt.map((x, j) => j === i ? { ...x, ad: e.target.value } : x))} />
                    </td>
                    <td>
                      <input value={m.aciklama} className="girdi !py-2 !text-sm !min-w-[260px]"
                        onChange={(e) => setMnt(mnt.map((x, j) => j === i ? { ...x, aciklama: e.target.value } : x))} />
                    </td>
                    <td>
                      <input type="number" step="0.1" value={m.m2_per_kwp} className="girdi !w-24 !py-2 !text-sm"
                        onChange={(e) => setMnt(mnt.map((x, j) => j === i ? { ...x, m2_per_kwp: Number(e.target.value) } : x))} />
                    </td>
                    <td>
                      <input type="number" step="0.01" value={m.carpan} className="girdi !w-24 !py-2 !text-sm"
                        onChange={(e) => setMnt(mnt.map((x, j) => j === i ? { ...x, carpan: Number(e.target.value) } : x))} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button disabled={kaydediliyor} onClick={() => kaydet("montaj_tipleri", mnt, "kod")}
            className="btn-birincil mt-6 disabled:opacity-60">Kaydet</button>
        </div>
      )}

      {/* ---------- İLLER ---------- */}
      {sekme === "il" && (
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="font-bold text-lacivert">İl bazlı yıllık verim (kWh / kWp / yıl)</h2>
          <p className="mt-1.5 text-sm text-slate-600">
            Bölgenin güneşlenme değeri. Kayıplar ayrıca &quot;Sistem kayıpları&quot; katsayısıyla düşülür.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {ill.map((i, idx) => (
              <div key={i.kod}>
                <label className="etiket-form !mb-1.5">{i.ad}</label>
                <input type="number" value={i.verim} className="girdi !py-2.5 !text-sm"
                  onChange={(e) => setIll(ill.map((x, j) => j === idx ? { ...x, verim: Number(e.target.value) } : x))} />
              </div>
            ))}
          </div>
          <button disabled={kaydediliyor} onClick={() => kaydet("iller", ill, "kod")}
            className="btn-birincil mt-6 disabled:opacity-60">Kaydet</button>
        </div>
      )}
    </div>
  );
}
