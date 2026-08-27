import type { Metadata } from "next";
import Link from "next/link";
import SayfaBasligi from "@/components/SayfaBasligi";
import { sssGetir } from "@/lib/data";

export const metadata: Metadata = {
  title: "Sıkça Sorulan Sorular — Güneş Enerjisi Hakkında Her Şey",
  description:
    "Amortisman süresi, mahsuplaşma, izin süreçleri, bakım, çatı uygunluğu ve devlet destekleri hakkında en çok sorulan sorular ve net cevapları.",
};

export default async function SssSayfa() {
  const sss = await sssGetir();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: sss.map((s) => ({
      "@type": "Question",
      name: s.soru,
      acceptedAnswer: { "@type": "Answer", text: s.cevap },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SayfaBasligi
        etiket="S.S.S."
        baslik="Sıkça sorulan sorular"
        aciklama="Güneş enerjisi yatırımı yapmadan önce herkesin aklına gelen soruları, pazarlama dili olmadan cevapladık."
      />

      <section className="bg-white py-20">
        <div className="kapsayici max-w-3xl space-y-3">
          {sss.map((s) => (
            <details key={s.id} className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm open:border-yesil-400 open:shadow-md">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-lg font-bold text-lacivert">
                {s.soru}
                <span className="shrink-0 text-2xl font-normal text-yesil transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-4 leading-relaxed text-slate-600">{s.cevap}</p>
            </details>
          ))}

          <div className="!mt-12 rounded-2xl bg-slate-50 p-8 text-center">
            <h2 className="text-xl font-bold text-lacivert">Cevabını bulamadığınız bir soru mu var?</h2>
            <p className="mt-3 text-sm text-slate-600">
              Bize yazın veya arayın; teknik sorularınızı satış baskısı olmadan cevaplıyoruz.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link href="/iletisim" className="btn-birincil">Soru sor</Link>
              <Link href="/hesaplama" className="btn-cerceve">Fiyat hesapla</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
