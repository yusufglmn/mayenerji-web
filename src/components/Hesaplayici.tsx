"use client";
import { useMemo, useState } from "react";
import { hesapla } from "@/lib/calc";
import type { HesapVerisi, HesapGirdisi } from "@/lib/types";
import { tl, sayi } from "@/lib/format";
import { Ikon } from "./Ikon";

const KATEGORI_ESLESME: Record<string, string> = {
  mesken: "ev", ticarethane: "isyeri", sanayi: "sanayi", tarimsal: "tarim",
};

export default function Hesaplayici({ veri }: { veri: HesapVerisi }) {
  const [adim, setAdim] = useState(1);
  const [segment, setSegment] = useState(veri.gruplar[0]?.kod ?? "mesken");
  const [il, setIl] = useState("hatay");
  const [yontem, setYontem] = useState<"fatura" | "tuketim" | "cihaz">("fatura");
  const [faturaTl, setFaturaTl] = useState("");
  const [aylikKwh, setAylikKwh] = useState("");
  const [secilenCihazlar, setSecilenCihazlar] = useState<Record<number, number>>({});
  const [montaj, setMontaj] = useState("kiremit");
  const [alanM2, setAlanM2] = useState("");
  const [gosterildi, setGosterildi] = useState(false);

  const grup = veri.gruplar.find((g) => g.kod === segment);
  const kategori = KATEGORI_ESLESME[segment] ?? "ev";
  const kategoriCihazlari = veri.cihazlar.filter((c) => c.kategori === kategori);

  const girdi: HesapGirdisi = useMemo(() => ({
    segment, il, yontem, montaj,
    faturaTl: Number(faturaTl) || 0,
    aylikKwh: Number(aylikKwh) || 0,
    alanM2: Number(alanM2) || 0,
    cihazlar: Object.entries(secilenCihazlar)
      .filter(([, adet]) => adet > 0)
      .map(([id, adet]) => ({ id: Number(id), adet })),
  }), [segment, il, yontem, montaj, faturaTl, aylikKwh, alanM2, secilenCihazlar]);

  const sonuc = useMemo(() => hesapla(girdi, veri), [girdi, veri]);

  const girdiGecerli =
    (yontem === "fatura" && Number(faturaTl) > 0) ||
    (yontem === "tuketim" && Number(aylikKwh) > 0) ||
    (yontem === "cihaz" && Object.values(secilenCihazlar).some((a) => a > 0));

  const cihazAyarla = (id: number, delta: number) =>
    setSecilenCihazlar((p) => ({ ...p, [id]: Math.max(0, (p[id] ?? 0) + delta) }));

  return (
    <div className="mx-auto max-w-5xl">
      {/* ---------- Adım göstergesi ---------- */}
      <ol className="mb-8 flex items-center justify-between gap-2 sm:gap-4">
        {["Kim için?", "Tüketiminiz", "Çatı / alan", "Sonuç"].map((ad, i) => {
          const n = i + 1;
          const aktif = adim === n;
          const bitti = adim > n;
          return (
            <li key={ad} className="flex flex-1 items-center gap-2 sm:gap-3">
              <button
                onClick={() => n < adim && setAdim(n)}
                disabled={n > adim}
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold transition sm:h-10 sm:w-10 ${
                  bitti ? "bg-yesil text-white" : aktif ? "bg-lacivert text-white ring-4 ring-lacivert-100" : "bg-slate-200 text-slate-500"
                }`}>
                {bitti ? "✓" : n}
              </button>
              <span className={`hidden text-sm font-semibold sm:block ${aktif ? "text-lacivert" : "text-slate-400"}`}>{ad}</span>
              {n < 4 && <span className={`h-0.5 flex-1 rounded ${bitti ? "bg-yesil" : "bg-slate-200"}`} />}
            </li>
          );
        })}
      </ol>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
        {/* ================= ADIM 1: SEGMENT ================= */}
        {adim === 1 && (
          <div>
            <h2 className="text-2xl font-bold text-lacivert">Kurulum kimin için yapılacak?</h2>
            <p className="mt-2 text-sm text-slate-600">
              Abone grubunuz, elektrik birim fiyatınızı ve dolayısıyla tasarruf hesabını belirliyor.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {veri.gruplar.map((g) => (
                <button key={g.kod} onClick={() => {
                  setSegment(g.kod);
                  setMontaj(g.kod === "tarimsal" ? "arazi" : g.kod === "sanayi" ? "trapez" : "kiremit");
                  setSecilenCihazlar({});
                }}
                  className={`rounded-2xl border-2 p-5 text-left transition ${
                    segment === g.kod ? "border-yesil bg-yesil-100/50 shadow-md" : "border-slate-200 hover:border-slate-300 hover:shadow-sm"
                  }`}>
                  <div className="flex items-start gap-4">
                    <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                      segment === g.kod ? "bg-yesil text-white" : "bg-slate-100 text-slate-500"}`}>
                      <Ikon ad={g.ikon} className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className="font-bold text-lacivert">{g.ad}</h3>
                      <p className="mt-1 text-xs leading-relaxed text-slate-600">{g.aciklama}</p>
                      <p className="mt-2.5 text-xs font-bold text-yesil-700">
                        ≈ {sayi(g.elektrik_tl, 2)} ₺/kWh birim fiyat
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-8">
              <label className="etiket-form" htmlFor="il">Kurulum yapılacak il</label>
              <select id="il" value={il} onChange={(e) => setIl(e.target.value)} className="girdi max-w-sm">
                {veri.iller.map((i) => (
                  <option key={i.kod} value={i.kod}>
                    {i.ad} — yılda ~{sayi(i.verim)} kWh/kWp
                  </option>
                ))}
              </select>
              <p className="mt-2 text-xs text-slate-500">
                Güneşlenme değeri ile aynı panel farklı illerde farklı üretir.
              </p>
            </div>

            <div className="mt-10 flex justify-end">
              <button onClick={() => setAdim(2)} className="btn-birincil !px-7 !py-3.5">
                Devam et <Ikon ad="ok" className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================= ADIM 2: TÜKETİM ================= */}
        {adim === 2 && (
          <div>
            <h2 className="text-2xl font-bold text-lacivert">Ne kadar elektrik tüketiyorsunuz?</h2>
            <p className="mt-2 text-sm text-slate-600">
              Üç yöntemden size en kolay geleni seçin. Faturanızı biliyorsanız en pratiği ilk seçenektir.
            </p>

            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              {([
                ["fatura", "Elektrik faturam", "Aylık ortalama tutarı gir"],
                ["tuketim", "kWh tüketimim", "Faturadaki kWh değerini gir"],
                ["cihaz", "Cihazlarımı seçeyim", "Kullandığın cihazları işaretle"],
              ] as const).map(([kod, ad, aciklama]) => (
                <button key={kod} onClick={() => setYontem(kod)}
                  className={`rounded-xl border-2 p-4 text-left transition ${
                    yontem === kod ? "border-yesil bg-yesil-100/50" : "border-slate-200 hover:border-slate-300"
                  }`}>
                  <p className="text-sm font-bold text-lacivert">{ad}</p>
                  <p className="mt-1 text-xs text-slate-500">{aciklama}</p>
                </button>
              ))}
            </div>

            <div className="mt-8">
              {yontem === "fatura" && (
                <div className="max-w-md">
                  <label className="etiket-form" htmlFor="fatura">Aylık ortalama elektrik faturanız (₺)</label>
                  <div className="relative">
                    <input id="fatura" type="number" min={0} inputMode="numeric" value={faturaTl}
                      onChange={(e) => setFaturaTl(e.target.value)} className="girdi pr-12" placeholder="örn. 4500" />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">₺</span>
                  </div>
                  <p className="mt-2 text-xs text-slate-500">
                    Yaz ve kış faturalarınızın ortalamasını girin. Sistem, {grup?.ad} tarifesindeki{" "}
                    <strong>{sayi(grup?.elektrik_tl ?? 0, 2)} ₺/kWh</strong> birim fiyatla tüketiminizi çıkarır.
                  </p>
                  {Number(faturaTl) > 0 && (
                    <p className="mt-3 rounded-xl bg-lacivert-100 px-4 py-3 text-sm font-semibold text-lacivert">
                      ≈ Aylık {sayi(sonuc.aylikKwh)} kWh · Yıllık {sayi(sonuc.yillikKwh)} kWh
                    </p>
                  )}
                </div>
              )}

              {yontem === "tuketim" && (
                <div className="max-w-md">
                  <label className="etiket-form" htmlFor="kwh">Aylık ortalama tüketiminiz (kWh)</label>
                  <div className="relative">
                    <input id="kwh" type="number" min={0} inputMode="numeric" value={aylikKwh}
                      onChange={(e) => setAylikKwh(e.target.value)} className="girdi pr-16" placeholder="örn. 1200" />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">kWh</span>
                  </div>
                  <p className="mt-2 text-xs text-slate-500">
                    Faturanızda &quot;Tüketim (kWh)&quot; satırında yazar. Yıllık toplamı 12&apos;ye bölerek de girebilirsiniz.
                  </p>
                </div>
              )}

              {yontem === "cihaz" && (
                <div>
                  <p className="text-sm text-slate-600">
                    <strong className="text-lacivert">{grup?.ad}</strong> kategorisindeki cihazlardan
                    kullandıklarınızın adedini artırın. Sistem, ortalama günlük çalışma süreleriyle
                    tüketiminizi tahmin eder.
                  </p>
                  <div className="mt-5 grid max-h-[420px] gap-2 overflow-y-auto pr-1 sm:grid-cols-2">
                    {kategoriCihazlari.length === 0 && (
                      <p className="col-span-2 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
                        Cihaz listesi henüz yüklenmemiş. Lütfen fatura veya kWh yöntemini kullanın.
                        (Yönetici: Supabase&apos;e <code>seed.sql</code> dosyasını çalıştırın.)
                      </p>
                    )}
                    {kategoriCihazlari.map((c) => {
                      const adet = secilenCihazlar[c.id] ?? 0;
                      return (
                        <div key={c.id}
                          className={`flex items-center justify-between gap-3 rounded-xl border p-3 transition ${
                            adet > 0 ? "border-yesil bg-yesil-100/40" : "border-slate-200"
                          }`}>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-lacivert">{c.ad}</p>
                            <p className="text-[11px] text-slate-500">
                              {sayi(c.guc_w)} W · günde {sayi(c.gunluk_saat, 1)} saat
                            </p>
                          </div>
                          <div className="flex shrink-0 items-center gap-1.5">
                            <button onClick={() => cihazAyarla(c.id, -1)} disabled={adet === 0}
                              className="h-8 w-8 rounded-lg bg-slate-100 font-bold text-slate-600 disabled:opacity-40 hover:bg-slate-200">−</button>
                            <span className="w-6 text-center text-sm font-bold text-lacivert">{adet}</span>
                            <button onClick={() => cihazAyarla(c.id, 1)}
                              className="h-8 w-8 rounded-lg bg-yesil font-bold text-white hover:bg-yesil-700">+</button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {girdiGecerli && (
                    <p className="mt-4 rounded-xl bg-lacivert-100 px-4 py-3 text-sm font-semibold text-lacivert">
                      ≈ Aylık {sayi(sonuc.aylikKwh)} kWh · Tahmini fatura {tl(sonuc.aylikKwh * (grup?.elektrik_tl ?? 4))}
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="mt-10 flex justify-between">
              <button onClick={() => setAdim(1)} className="btn-cerceve !px-6 !py-3.5">Geri</button>
              <button onClick={() => setAdim(3)} disabled={!girdiGecerli}
                className="btn-birincil !px-7 !py-3.5 disabled:cursor-not-allowed disabled:opacity-50">
                Devam et <Ikon ad="ok" className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================= ADIM 3: ÇATI / ALAN ================= */}
        {adim === 3 && (
          <div>
            <h2 className="text-2xl font-bold text-lacivert">Panelleri nereye kuracağız?</h2>
            <p className="mt-2 text-sm text-slate-600">
              Montaj tipi hem gereken alanı hem de konstrüksiyon maliyetini etkiler.
            </p>

            <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {veri.montajlar.map((m) => (
                <button key={m.kod} onClick={() => setMontaj(m.kod)}
                  className={`rounded-xl border-2 p-4 text-left transition ${
                    montaj === m.kod ? "border-yesil bg-yesil-100/50" : "border-slate-200 hover:border-slate-300"
                  }`}>
                  <p className="text-sm font-bold text-lacivert">{m.ad}</p>
                  <p className="mt-1 text-xs leading-relaxed text-slate-500">{m.aciklama}</p>
                  <p className="mt-2 text-[11px] font-bold text-yesil-700">
                    kWp başına ~{sayi(m.m2_per_kwp, 1)} m²
                  </p>
                </button>
              ))}
            </div>

            <div className="mt-8 max-w-md">
              <label className="etiket-form" htmlFor="alan">
                Kullanılabilir çatı / arazi alanınız (m²) <span className="font-normal text-slate-400">— isteğe bağlı</span>
              </label>
              <div className="relative">
                <input id="alan" type="number" min={0} inputMode="numeric" value={alanM2}
                  onChange={(e) => setAlanM2(e.target.value)} className="girdi pr-14" placeholder="örn. 80" />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">m²</span>
              </div>
              <p className="mt-2 text-xs text-slate-500">
                Biliyorsanız girin; sistem kapasiteyi alanınızla sınırlar. Bilmiyorsanız boş bırakın —
                ihtiyacınıza göre hesaplanır ve gereken alanı biz söyleriz.
              </p>
              {Number(alanM2) > 0 && (
                <p className="mt-3 rounded-xl bg-lacivert-100 px-4 py-3 text-sm font-semibold text-lacivert">
                  Bu alana en fazla ≈ {sayi(Number(alanM2) / (veri.montajlar.find((m) => m.kod === montaj)?.m2_per_kwp ?? 5.5), 1)} kWp sığar
                </p>
              )}
            </div>

            <div className="mt-10 flex justify-between">
              <button onClick={() => setAdim(2)} className="btn-cerceve !px-6 !py-3.5">Geri</button>
              <button onClick={() => { setAdim(4); setGosterildi(true); }} className="btn-gunes !px-7 !py-3.5">
                <Ikon ad="hesap" className="h-4 w-4" /> Sonucu Göster
              </button>
            </div>
          </div>
        )}

        {/* ================= ADIM 4: SONUÇ ================= */}
        {adim === 4 && gosterildi && (
          <Sonuc sonuc={sonuc} girdi={girdi} veri={veri} geri={() => setAdim(3)} />
        )}
      </div>

      <p className="mt-6 text-center text-xs leading-relaxed text-slate-500">
        Bu araç bir ön fizibilite hesaplayıcısıdır. Gerçek maliyet; çatı yönü, gölgelenme, mevcut
        elektrik altyapısı, tercih edilen panel ve inverter markası ile güncel döviz kuruna göre
        değişir. Kesin fiyat için ücretsiz keşif talep edin.
      </p>
    </div>
  );
}

/* ===================== SONUÇ EKRANI ===================== */
function Sonuc({
  sonuc, girdi, veri, geri,
}: {
  sonuc: ReturnType<typeof hesapla>;
  girdi: HesapGirdisi;
  veri: HesapVerisi;
  geri: () => void;
}) {
  const [formAcik, setFormAcik] = useState(false);
  const [durum, setDurum] = useState<"bos" | "gonderiliyor" | "tamam" | "hata">("bos");
  const [hata, setHata] = useState("");

  const grup = veri.gruplar.find((g) => g.kod === girdi.segment);
  const il = veri.iller.find((i) => i.kod === girdi.il);
  const panelW = veri.parametreler.panel_watt ?? 620;

  async function teklifGonder(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setDurum("gonderiliyor");
    const fd = new FormData(e.currentTarget);
    try {
      const r = await fetch("/api/teklif", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ad_soyad: fd.get("ad_soyad"),
          telefon: fd.get("telefon"),
          eposta: fd.get("eposta"),
          not_metni: fd.get("not_metni"),
          il: il?.ad ?? girdi.il,
          segment: grup?.ad ?? girdi.segment,
          girdi, sonuc,
        }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.hata || "Talep gönderilemedi.");
      setDurum("tamam");
    } catch (err) {
      setHata(err instanceof Error ? err.message : "Bir hata oluştu.");
      setDurum("hata");
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="etiket">Tahmini sonuç</span>
          <h2 className="mt-3 text-2xl font-bold text-lacivert">Size özel güneş enerjisi projeniz</h2>
          <p className="mt-1.5 text-sm text-slate-600">
            {grup?.ad} · {il?.ad} · {veri.montajlar.find((m) => m.kod === girdi.montaj)?.ad}
          </p>
        </div>
        <button onClick={geri} className="btn-cerceve !px-5 !py-2.5 text-xs">Bilgileri düzenle</button>
      </div>

      {/* Ana metrikler */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { etiket: "Önerilen sistem gücü", deger: `${sayi(sonuc.onerilenKwp, 2)} kWp`, alt: `${sonuc.panelSayisi} adet × ${sayi(panelW)} W panel`, renk: "lacivert" },
          { etiket: "Tahmini maliyet", deger: `${sayi(sonuc.maliyetAltTl / 1000)}–${sayi(sonuc.maliyetUstTl / 1000)} bin ₺`, alt: "Anahtar teslim, KDV dahil", renk: "gunes" },
          { etiket: "Yıllık tasarruf", deger: tl(sonuc.yillikTasarrufTl), alt: `Ayda ≈ ${tl(sonuc.aylikTasarrufTl)}`, renk: "yesil" },
          { etiket: "Amortisman süresi", deger: `${sayi(sonuc.amortismanYil, 1)} yıl`, alt: "Sonrası net kazanç", renk: "yesil" },
        ].map((k) => (
          <div key={k.etiket} className={`rounded-2xl p-5 ${
            k.renk === "gunes" ? "bg-gunes-100" : k.renk === "yesil" ? "bg-yesil-100" : "bg-lacivert-100"}`}>
            <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">{k.etiket}</p>
            <p className={`mt-2 text-2xl font-extrabold ${
              k.renk === "gunes" ? "text-gunes-600" : k.renk === "yesil" ? "text-yesil-700" : "text-lacivert"}`}>
              {k.deger}
            </p>
            <p className="mt-1 text-xs text-slate-600">{k.alt}</p>
          </div>
        ))}
      </div>

      {sonuc.alanKisitliMi && (
        <p className="mt-5 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-900">
          <strong>Not:</strong> Girdiğiniz {sayi(girdi.alanM2 ?? 0)} m² alan, tüketiminizin tamamını
          karşılayacak sisteme yetmiyor. Bu alanla ihtiyacınızın <strong>%{sayi(sonuc.karsilamaOrani)}</strong>&apos;ini
          karşılayabiliriz. Ek alan (sundurma, ikinci çatı, arazi) varsa keşifte değerlendirebiliriz.
        </p>
      )}

      {/* Detay tablosu */}
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 p-6">
          <h3 className="text-sm font-bold uppercase tracking-wide text-slate-400">Teknik detaylar</h3>
          <dl className="mt-4 space-y-3 text-sm">
            {[
              ["Aylık tüketiminiz", `${sayi(sonuc.aylikKwh)} kWh`],
              ["Yıllık tüketiminiz", `${sayi(sonuc.yillikKwh)} kWh`],
              ["Yıllık üretim", `${sayi(sonuc.yillikUretimKwh)} kWh`],
              ["İhtiyacı karşılama", `%${sayi(sonuc.karsilamaOrani)}`],
              ["Panel sayısı", `${sonuc.panelSayisi} adet (${sayi(panelW)} W)`],
              ["Gereken alan", `≈ ${sayi(sonuc.gerekliAlanM2)} m²`],
              ["Elektrik birim fiyatı", `${sayi(sonuc.elektrikTl, 2)} ₺/kWh`],
            ].map(([k, v]) => (
              <div key={k} className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <dt className="text-slate-600">{k}</dt>
                <dd className="font-bold text-lacivert">{v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="rounded-2xl border border-slate-200 p-6">
          <h3 className="text-sm font-bold uppercase tracking-wide text-slate-400">Yatırım özeti</h3>
          <dl className="mt-4 space-y-3 text-sm">
            {[
              ["Tahmini alt maliyet", tl(sonuc.maliyetAltTl)],
              ["Tahmini üst maliyet", tl(sonuc.maliyetUstTl)],
              ["kWp başına maliyet", tl(sonuc.tlPerKwp)],
              ["Aylık tasarruf", tl(sonuc.aylikTasarrufTl)],
              ["Yıllık tasarruf", tl(sonuc.yillikTasarrufTl)],
              ["Amortisman", `${sayi(sonuc.amortismanYil, 1)} yıl`],
            ].map(([k, v]) => (
              <div key={k} className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <dt className="text-slate-600">{k}</dt>
                <dd className="font-bold text-lacivert">{v}</dd>
              </div>
            ))}
            <div className="flex items-center justify-between rounded-xl bg-yesil-100 px-4 py-3">
              <dt className="font-semibold text-yesil-700">25 yıllık toplam kazanç <span className="block text-[10px] font-normal opacity-70">bugünkü para ile</span></dt>
              <dd className="font-extrabold text-yesil-700">{tl(sonuc.yirmiBesYilKazancTl)}</dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Çevre */}
      <div className="mt-6 flex flex-wrap items-center gap-6 rounded-2xl bg-slate-50 px-6 py-5">
        <Ikon ad="yaprak" className="h-8 w-8 shrink-0 text-yesil" />
        <p className="text-sm text-slate-700">
          Bu sistem yılda <strong className="text-yesil-700">{sayi(sonuc.yillikCo2Kg / 1000, 1)} ton CO₂</strong> salımını
          önler — yaklaşık <strong className="text-yesil-700">{sayi(sonuc.agacEsdegeri)} ağacın</strong> yıllık
          karbon tutumuna eşdeğerdir.
        </p>
      </div>

      {/* Teklif formu */}
      {durum === "tamam" ? (
        <div className="mt-8 rounded-2xl bg-yesil-100 p-8 text-center">
          <Ikon ad="onay" className="mx-auto h-12 w-12 text-yesil" />
          <h3 className="mt-4 text-lg font-bold text-yesil-700">Talebiniz bize ulaştı</h3>
          <p className="mt-2 text-sm text-slate-600">
            Hesaplamanızın detayları ekibimize iletildi. En kısa sürede sizi arayıp ücretsiz keşif
            için randevu oluşturacağız.
          </p>
        </div>
      ) : !formAcik ? (
        <div className="mt-8 rounded-2xl bg-lacivert p-8 text-center">
          <h3 className="text-xl font-bold text-white">Bu rakamları netleştirelim mi?</h3>
          <p className="mx-auto mt-3 max-w-xl text-sm text-slate-300">
            Yukarıdaki değerler tahminidir. Ücretsiz keşifte çatınızı ölçüp gölge analizi yaparak
            size bağlayıcı ve net bir teklif hazırlayalım.
          </p>
          <button onClick={() => setFormAcik(true)} className="btn-gunes mt-6 !px-7 !py-4">
            Ücretsiz keşif talebi oluştur
          </button>
        </div>
      ) : (
        <form onSubmit={teklifGonder} className="mt-8 rounded-2xl border-2 border-yesil-100 bg-yesil-100/30 p-8">
          <h3 className="text-lg font-bold text-lacivert">Ücretsiz keşif talebi</h3>
          <p className="mt-1.5 text-sm text-slate-600">
            Hesapladığınız sonuç talebinize otomatik eklenecek — tekrar anlatmanıza gerek yok.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <input name="ad_soyad" required className="girdi" placeholder="Ad Soyad *" />
            <input name="telefon" required type="tel" className="girdi" placeholder="Telefon *" />
            <input name="eposta" type="email" className="girdi" placeholder="E-posta" />
          </div>
          <textarea name="not_metni" rows={3} className="girdi mt-4 resize-none"
            placeholder="Eklemek istediğiniz not (adres, çatı durumu, uygun olduğunuz saatler…)" />
          {durum === "hata" && (
            <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{hata}</p>
          )}
          <div className="mt-5 flex flex-wrap gap-3">
            <button type="submit" disabled={durum === "gonderiliyor"} className="btn-birincil !px-7 !py-3.5 disabled:opacity-60">
              {durum === "gonderiliyor" ? "Gönderiliyor…" : "Talebi gönder"}
            </button>
            <button type="button" onClick={() => setFormAcik(false)} className="btn-cerceve !px-6 !py-3.5">Vazgeç</button>
          </div>
        </form>
      )}
    </div>
  );
}
