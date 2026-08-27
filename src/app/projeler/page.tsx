import type { Metadata } from "next";
import Link from "next/link";
import SayfaBasligi from "@/components/SayfaBasligi";
import { Ikon } from "@/components/Ikon";
import { projeleriGetir } from "@/lib/data";
import { sayi, tarih } from "@/lib/format";

export const metadata: Metadata = {
  title: "Projelerimiz — Tamamlanan GES Kurulumları",
  description:
    "Hatay ve çevre illerde tamamladığımız konut, iş yeri, sanayi ve tarımsal güneş enerji sistemi projelerimiz.",
};

const SEGMENT_AD: Record<string, string> = {
  mesken: "Konut", ticarethane: "İş Yeri", sanayi: "Sanayi", tarimsal: "Tarımsal",
};

export default async function Projeler() {
  const projeler = await projeleriGetir();

  return (
    <>
      <SayfaBasligi
        etiket="Referanslarımız"
        baslik="Tamamladığımız projeler"
        aciklama="Her proje farklı bir çatı, farklı bir tüketim profili ve farklı bir hikaye. İşte sahada yaptıklarımız."
      />

      <section className="bg-white py-20">
        <div className="kapsayici">
          {projeler.length === 0 ? (
            <div className="mx-auto max-w-xl rounded-3xl border-2 border-dashed border-slate-300 bg-slate-50 p-12 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-yesil shadow-sm">
                <Ikon ad="gunes" className="h-7 w-7" />
              </div>
              <h2 className="mt-6 text-xl font-bold text-lacivert">Proje galerimiz çok yakında</h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                Tamamladığımız kurulumların fotoğraflarını ve teknik detaylarını burada
                yayınlıyoruz. Şu an aktif projelerimizin çekimleri hazırlanıyor.
              </p>
              <p className="mt-4 text-xs text-slate-400">
                (Yönetici notu: Yönetim panelinden <strong>Projeler &gt; Yeni proje</strong> ile
                fotoğraf ve bilgi eklediğinizde bu sayfa otomatik dolacaktır.)
              </p>
              <Link href="/iletisim" className="btn-birincil mt-7">Referans talebi için bize ulaşın</Link>
            </div>
          ) : (
            <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {projeler.map((p) => (
                <article key={p.id} className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-lg">
                  {p.kapak_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.kapak_url} alt={p.baslik} className="h-56 w-full object-cover transition duration-300 group-hover:scale-105" />
                  ) : (
                    <div className="flex h-56 items-center justify-center bg-lacivert-100 text-lacivert">
                      <Ikon ad="gunes" className="h-12 w-12" />
                    </div>
                  )}
                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex flex-wrap gap-2 text-[11px] font-bold uppercase tracking-wide">
                      <span className="rounded-full bg-yesil-100 px-2.5 py-1 text-yesil-700">
                        {SEGMENT_AD[p.segment] ?? p.segment}
                      </span>
                      {p.konum && <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-600">{p.konum}</span>}
                    </div>
                    <h2 className="mt-3.5 text-lg font-bold text-lacivert">{p.baslik}</h2>
                    {p.ozet && <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{p.ozet}</p>}

                    <dl className="mt-5 grid grid-cols-3 gap-3 border-t border-slate-100 pt-4 text-center">
                      <div>
                        <dt className="text-[10px] font-bold uppercase text-slate-400">Güç</dt>
                        <dd className="mt-0.5 text-sm font-bold text-lacivert">
                          {p.guc_kwp ? `${sayi(p.guc_kwp, 2)} kWp` : "—"}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-[10px] font-bold uppercase text-slate-400">Panel</dt>
                        <dd className="mt-0.5 text-sm font-bold text-lacivert">
                          {p.panel_sayisi ? `${p.panel_sayisi} adet` : "—"}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-[10px] font-bold uppercase text-slate-400">Tarih</dt>
                        <dd className="mt-0.5 text-sm font-bold text-lacivert">
                          {p.tamamlanma ? new Date(p.tamamlanma).getFullYear() : "—"}
                        </dd>
                      </div>
                    </dl>

                    {p.galeri?.length > 0 && (
                      <div className="mt-4 flex gap-2 overflow-x-auto">
                        {p.galeri.slice(0, 4).map((g, i) => (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img key={i} src={g} alt={`${p.baslik} ${i + 1}`}
                            className="h-14 w-14 shrink-0 rounded-lg object-cover" />
                        ))}
                      </div>
                    )}
                    {p.tamamlanma && (
                      <p className="mt-4 text-[11px] text-slate-400">Tamamlanma: {tarih(p.tamamlanma)}</p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="bg-yesil py-16">
        <div className="kapsayici flex flex-col items-center gap-6 text-center">
          <h2 className="text-3xl font-bold text-white">Sıradaki proje sizinki olsun</h2>
          <p className="max-w-xl text-green-50">
            Çatınızı ölçelim, tüketiminizi analiz edelim, size özel projeyi rakamlarla sunalım.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/hesaplama" className="btn bg-white !px-7 !py-4 text-yesil-700 hover:bg-slate-100">Fiyat hesapla</Link>
            <Link href="/iletisim" className="btn !border-2 !border-white !px-7 !py-4 text-white hover:bg-white hover:text-yesil-700">Keşif iste</Link>
          </div>
        </div>
      </section>
    </>
  );
}
