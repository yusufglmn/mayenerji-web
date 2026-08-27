"use client";
import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";
import { tarihSaat, tl, sayi } from "@/lib/format";
import type { Talep, Mesaj } from "@/lib/types";

const DURUMLAR = [
  ["yeni", "Yeni", "bg-gunes-100 text-gunes-600"],
  ["arandi", "Arandı", "bg-blue-100 text-blue-700"],
  ["teklif", "Teklif verildi", "bg-purple-100 text-purple-700"],
  ["kazanildi", "Kazanıldı", "bg-yesil-100 text-yesil-700"],
  ["kaybedildi", "Kaybedildi", "bg-slate-200 text-slate-600"],
] as const;

export default function TaleplerIstemci({ talepler, mesajlar }: { talepler: Talep[]; mesajlar: Mesaj[] }) {
  const [sekme, setSekme] = useState<"talep" | "mesaj">("talep");
  const [liste, setListe] = useState(talepler);
  const [msjListe, setMsjListe] = useState(mesajlar);
  const [acik, setAcik] = useState<number | null>(null);
  const [filtre, setFiltre] = useState("hepsi");

  async function durumDegistir(id: number, durum: string) {
    setListe((p) => p.map((t) => (t.id === id ? { ...t, durum } : t)));
    await supabaseBrowser().from("talepler").update({ durum }).eq("id", id);
  }

  async function okunduIsaretle(id: number) {
    setMsjListe((p) => p.map((m) => (m.id === id ? { ...m, okundu: true } : m)));
    await supabaseBrowser().from("mesajlar").update({ okundu: true }).eq("id", id);
  }

  const gosterilecek = filtre === "hepsi" ? liste : liste.filter((t) => t.durum === filtre);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-lacivert">Talepler ve Mesajlar</h1>
        <p className="mt-1.5 text-sm text-slate-600">
          Hesaplayıcıdan gelen teklif talepleri ve iletişim formundan gelen mesajlar.
        </p>
      </div>

      <div className="flex gap-2">
        {([["talep", `Teklif talepleri (${liste.length})`], ["mesaj", `Mesajlar (${msjListe.filter((m) => !m.okundu).length} okunmamış)`]] as const).map(([k, ad]) => (
          <button key={k} onClick={() => setSekme(k)}
            className={`rounded-xl px-5 py-2.5 text-sm font-bold transition ${
              sekme === k ? "bg-lacivert text-white" : "bg-white text-slate-600 hover:bg-slate-50"}`}>
            {ad}
          </button>
        ))}
      </div>

      {sekme === "talep" ? (
        <>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setFiltre("hepsi")}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold ${filtre === "hepsi" ? "bg-lacivert text-white" : "bg-white text-slate-600"}`}>
              Hepsi
            </button>
            {DURUMLAR.map(([k, ad]) => (
              <button key={k} onClick={() => setFiltre(k)}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold ${filtre === k ? "bg-lacivert text-white" : "bg-white text-slate-600"}`}>
                {ad} ({liste.filter((t) => t.durum === k).length})
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {gosterilecek.length === 0 && (
              <p className="rounded-2xl bg-white px-6 py-12 text-center text-sm text-slate-500 shadow-sm">
                Bu filtrede kayıt yok.
              </p>
            )}
            {gosterilecek.map((t) => {
              const s = (t.sonuc ?? {}) as Record<string, number>;
              const g = (t.girdi ?? {}) as Record<string, unknown>;
              const acikMi = acik === t.id;
              const renk = DURUMLAR.find((d) => d[0] === t.durum)?.[2] ?? "bg-slate-100 text-slate-600";
              return (
                <div key={t.id} className="rounded-2xl bg-white shadow-sm">
                  <button onClick={() => setAcik(acikMi ? null : t.id)}
                    className="flex w-full flex-wrap items-center justify-between gap-4 p-5 text-left">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span className="font-bold text-lacivert">{t.ad_soyad}</span>
                        <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase ${renk}`}>
                          {DURUMLAR.find((d) => d[0] === t.durum)?.[1] ?? t.durum}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-slate-500">
                        {tarihSaat(t.olusturuldu)} · {t.telefon} · {t.segment} · {t.il}
                      </p>
                    </div>
                    <div className="flex items-center gap-5 text-right text-xs">
                      <div>
                        <p className="font-bold text-lacivert">{sayi(s.onerilenKwp ?? 0, 2)} kWp</p>
                        <p className="text-slate-400">{s.panelSayisi ?? 0} panel</p>
                      </div>
                      <div>
                        <p className="font-bold text-yesil-700">{tl(s.maliyetTl ?? 0)}</p>
                        <p className="text-slate-400">{sayi(s.amortismanYil ?? 0, 1)} yıl amortisman</p>
                      </div>
                      <span className="text-slate-400">{acikMi ? "▲" : "▼"}</span>
                    </div>
                  </button>

                  {acikMi && (
                    <div className="border-t border-slate-100 p-5">
                      <div className="grid gap-6 md:grid-cols-2">
                        <div>
                          <h3 className="text-xs font-bold uppercase tracking-wide text-slate-400">İletişim</h3>
                          <dl className="mt-3 space-y-2 text-sm">
                            <div className="flex justify-between border-b border-slate-100 pb-2">
                              <dt className="text-slate-500">Telefon</dt>
                              <dd><a href={`tel:${t.telefon}`} className="font-bold text-yesil hover:underline">{t.telefon}</a></dd>
                            </div>
                            <div className="flex justify-between border-b border-slate-100 pb-2">
                              <dt className="text-slate-500">E-posta</dt>
                              <dd>{t.eposta ? <a href={`mailto:${t.eposta}`} className="font-bold text-yesil hover:underline">{t.eposta}</a> : "—"}</dd>
                            </div>
                            <div className="flex justify-between border-b border-slate-100 pb-2">
                              <dt className="text-slate-500">Montaj tipi</dt>
                              <dd className="font-semibold">{String(g.montaj ?? "—")}</dd>
                            </div>
                            <div className="flex justify-between border-b border-slate-100 pb-2">
                              <dt className="text-slate-500">Belirtilen alan</dt>
                              <dd className="font-semibold">{g.alanM2 ? `${g.alanM2} m²` : "—"}</dd>
                            </div>
                          </dl>
                          {t.not_metni && (
                            <div className="mt-4 rounded-xl bg-slate-50 p-4">
                              <p className="text-xs font-bold uppercase text-slate-400">Müşteri notu</p>
                              <p className="mt-1.5 whitespace-pre-wrap text-sm text-slate-700">{t.not_metni}</p>
                            </div>
                          )}
                        </div>

                        <div>
                          <h3 className="text-xs font-bold uppercase tracking-wide text-slate-400">Hesaplama sonucu</h3>
                          <dl className="mt-3 space-y-2 text-sm">
                            {[
                              ["Aylık tüketim", `${sayi(s.aylikKwh ?? 0)} kWh`],
                              ["Önerilen güç", `${sayi(s.onerilenKwp ?? 0, 2)} kWp`],
                              ["Panel sayısı", `${s.panelSayisi ?? 0} adet`],
                              ["Gereken alan", `${sayi(s.gerekliAlanM2 ?? 0)} m²`],
                              ["Maliyet aralığı", `${tl(s.maliyetAltTl ?? 0)} – ${tl(s.maliyetUstTl ?? 0)}`],
                              ["Yıllık tasarruf", tl(s.yillikTasarrufTl ?? 0)],
                              ["Amortisman", `${sayi(s.amortismanYil ?? 0, 1)} yıl`],
                            ].map(([k, v]) => (
                              <div key={k} className="flex justify-between border-b border-slate-100 pb-2">
                                <dt className="text-slate-500">{k}</dt>
                                <dd className="font-bold text-lacivert">{v}</dd>
                              </div>
                            ))}
                          </dl>
                        </div>
                      </div>

                      <div className="mt-6">
                        <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Durumu değiştir</p>
                        <div className="mt-2.5 flex flex-wrap gap-2">
                          {DURUMLAR.map(([k, ad, renk2]) => (
                            <button key={k} onClick={() => durumDegistir(t.id, k)}
                              className={`rounded-lg px-3.5 py-2 text-xs font-bold transition ${
                                t.durum === k ? renk2 + " ring-2 ring-offset-1 ring-current" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
                              {ad}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <div className="space-y-3">
          {msjListe.length === 0 && (
            <p className="rounded-2xl bg-white px-6 py-12 text-center text-sm text-slate-500 shadow-sm">Henüz mesaj yok.</p>
          )}
          {msjListe.map((m) => (
            <div key={m.id} className={`rounded-2xl bg-white p-5 shadow-sm ${!m.okundu ? "border-l-4 border-gunes" : ""}`}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-bold text-lacivert">{m.ad_soyad}</p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {tarihSaat(m.olusturuldu)} · {m.telefon} {m.eposta && `· ${m.eposta}`}
                  </p>
                  {m.konu && <p className="mt-1.5 text-xs font-bold uppercase text-yesil-700">{m.konu}</p>}
                </div>
                {!m.okundu && (
                  <button onClick={() => okunduIsaretle(m.id)} className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-200">
                    Okundu işaretle
                  </button>
                )}
              </div>
              <p className="mt-4 whitespace-pre-wrap rounded-xl bg-slate-50 p-4 text-sm text-slate-700">{m.mesaj}</p>
              <div className="mt-3 flex gap-2">
                <a href={`tel:${m.telefon}`} className="rounded-lg bg-yesil px-3.5 py-2 text-xs font-bold text-white">Ara</a>
                {m.eposta && <a href={`mailto:${m.eposta}`} className="rounded-lg bg-lacivert px-3.5 py-2 text-xs font-bold text-white">E-posta gönder</a>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
