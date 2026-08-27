import type { Metadata } from "next";
import SayfaBasligi from "@/components/SayfaBasligi";
import { Ikon } from "@/components/Ikon";
import IletisimFormu from "@/components/IletisimFormu";
import { ayarlariGetir } from "@/lib/data";

export const metadata: Metadata = {
  title: "İletişim — Ücretsiz Keşif ve Teklif",
  description:
    "MAY Enerji ve Yazılım ile iletişime geçin. Hatay Defne merkezimizden ücretsiz keşif ve teklif için bize ulaşın.",
};

export default async function Iletisim() {
  const ayar = await ayarlariGetir();

  return (
    <>
      <SayfaBasligi
        etiket="İletişim"
        baslik="Konuşalım, ölçelim, hesaplayalım"
        aciklama="Keşif ve teklif tamamen ücretsizdir, hiçbir bağlayıcılığı yoktur. Formu doldurun ya da doğrudan arayın."
      />

      <section className="bg-white py-20">
        <div className="kapsayici grid gap-12 lg:grid-cols-[1fr_1.15fr]">
          {/* Bilgiler */}
          <div className="space-y-6">
            <div className="rounded-3xl bg-slate-50 p-8">
              <h2 className="text-xl font-bold text-lacivert">İletişim bilgilerimiz</h2>
              <ul className="mt-7 space-y-6">
                <li className="flex gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-yesil shadow-sm">
                    <Ikon ad="konum" className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Adres</p>
                    <p className="mt-1 font-semibold text-lacivert">{ayar.adres_detay}</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-yesil shadow-sm">
                    <Ikon ad="telefon" className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Telefon</p>
                    <a href={`tel:${ayar.telefon.replace(/\s/g, "")}`} className="mt-1 block font-semibold text-lacivert hover:text-yesil">
                      {ayar.telefon}
                    </a>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-yesil shadow-sm">
                    <Ikon ad="mail" className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-400">E-posta</p>
                    <a href={`mailto:${ayar.eposta}`} className="mt-1 block break-all font-semibold text-lacivert hover:text-yesil">
                      {ayar.eposta}
                    </a>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-yesil shadow-sm">
                    <Ikon ad="saat" className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Çalışma saatleri</p>
                    <p className="mt-1 font-semibold text-lacivert">{ayar.calisma_saati}</p>
                  </div>
                </li>
              </ul>

              {ayar.whatsapp && (
                <a href={`https://wa.me/${ayar.whatsapp}`} target="_blank" rel="noopener noreferrer"
                  className="btn mt-8 w-full bg-[#25D366] !py-4 text-white hover:brightness-95">
                  WhatsApp&apos;tan yazın
                </a>
              )}
            </div>

            {ayar.harita_embed && (
              <div className="overflow-hidden rounded-3xl border border-slate-200 shadow-sm">
                <iframe src={ayar.harita_embed} width="100%" height="300" loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade" style={{ border: 0 }} title="Konum" />
              </div>
            )}
          </div>

          {/* Form */}
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm lg:p-10">
            <h2 className="text-xl font-bold text-lacivert">Bize mesaj gönderin</h2>
            <p className="mt-2 text-sm text-slate-600">
              En geç bir iş günü içinde size dönüş yapıyoruz.
            </p>
            <IletisimFormu />
          </div>
        </div>
      </section>
    </>
  );
}
