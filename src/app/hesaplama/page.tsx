import type { Metadata } from "next";
import SayfaBasligi from "@/components/SayfaBasligi";
import Hesaplayici from "@/components/Hesaplayici";
import { hesapVerisiGetir } from "@/lib/data";

export const metadata: Metadata = {
  title: "Güneş Enerjisi Fiyat Hesaplama — Ücretsiz Online Araç",
  description:
    "Elektrik faturanızı veya cihazlarınızı girin; gereken kurulu gücü, panel sayısını, tahmini maliyeti, yıllık tasarrufu ve amortisman süresini anında öğrenin.",
};

export default async function HesaplamaSayfa() {
  const veri = await hesapVerisiGetir();

  return (
    <>
      <SayfaBasligi
        etiket="Online hesaplama"
        baslik="Güneş enerjisi fiyat hesaplama"
        aciklama="Aşağıdaki adımları doldurun; sistem size gereken kurulu gücü, panel sayısını, tahmini maliyet aralığını ve yatırımın kaç yılda kendini ödeyeceğini hesaplasın."
      />
      <section className="bg-slate-50 py-14 sm:py-20">
        <div className="kapsayici">
          <Hesaplayici veri={veri} />
        </div>
      </section>
    </>
  );
}
