import type { Metadata } from "next";
import Link from "next/link";
import SayfaBasligi from "@/components/SayfaBasligi";
import { Ikon } from "@/components/Ikon";
import { hizmetleriGetir } from "@/lib/data";

export const metadata: Metadata = {
  title: "Hizmetlerimiz — Konut, Sanayi ve Tarımsal GES Kurulumu",
  description:
    "Konut çatı GES, iş yeri ve esnaf GES, sanayi tesisi GES, tarımsal sulama ve arazi GES, hibrit depolama ile bakım-izleme hizmetlerimiz.",
};

export default async function Hizmetler() {
  const hizmetler = await hizmetleriGetir();

  return (
    <>
      <SayfaBasligi
        etiket="Hizmetlerimiz"
        baslik="Her ihtiyaca uygun güneş enerjisi çözümü"
        aciklama="Panel satmakla kalmıyoruz. Tüketiminizi ölçüyor, doğru kapasiteyi hesaplıyor, resmi süreci yürütüyor ve kurulumdan sonra sistemi izlemeye devam ediyoruz."
      />

      <section className="bg-white py-20">
        <div className="kapsayici space-y-16">
          {hizmetler.map((h, i) => (
            <article key={h.id} id={h.slug}
              className={`grid items-center gap-10 lg:grid-cols-2 ${i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""}`}>
              <div>
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-yesil-100 text-yesil-700">
                  <Ikon ad={h.ikon} className="h-7 w-7" />
                </div>
                <h2 className="mt-6 text-2xl font-bold text-lacivert sm:text-3xl">{h.baslik}</h2>
                <p className="mt-4 text-base font-medium text-yesil-700">{h.ozet}</p>
                <p className="mt-4 leading-relaxed text-slate-600">{h.icerik}</p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <Link href="/hesaplama" className="btn-birincil">Fiyat hesapla</Link>
                  <Link href="/iletisim" className="btn-cerceve">Bize danışın</Link>
                </div>
              </div>
              <div className="rounded-3xl bg-slate-50 p-8 lg:p-10">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Bu hizmete dahil</h3>
                <ul className="mt-5 space-y-3.5">
                  {[
                    "Ücretsiz yerinde keşif ve gölge analizi",
                    "Tüketim profilinize göre kapasite hesabı",
                    "Panel, inverter ve konstrüksiyon tedariki",
                    "Dağıtım şirketi başvurusu ve proje onayı",
                    "Montaj, kablolama ve pano işleri",
                    "Çift yönlü sayaç ve devreye alma",
                    "Uzaktan izleme kurulumu ve eğitimi",
                    "Garanti kapsamında satış sonrası destek",
                  ].map((m) => (
                    <li key={m} className="flex gap-3 text-sm text-slate-700">
                      <Ikon ad="onay" className="h-5 w-5 shrink-0 text-yesil" /> {m}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-lacivert py-16">
        <div className="kapsayici flex flex-col items-center gap-6 text-center">
          <h2 className="text-3xl font-bold text-white">Hangi çözüm size uygun, birlikte bakalım</h2>
          <p className="max-w-2xl text-slate-300">
            Faturanızı ve çatınızı görmeden kesin konuşmuyoruz. Keşif ücretsiz, teklif bağlayıcı değil.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/hesaplama" className="btn-gunes !px-7 !py-4">Online fiyat hesapla</Link>
            <Link href="/iletisim" className="btn !border-2 !border-white/40 !px-7 !py-4 text-white hover:bg-white hover:text-lacivert">
              Keşif talebi gönder
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
