import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import SayfaBasligi from "@/components/SayfaBasligi";
import { Ikon } from "@/components/Ikon";
import { ayarlariGetir } from "@/lib/data";

export const metadata: Metadata = {
  title: "Hakkımızda — MAY Enerji ve Yazılım",
  description:
    "Hatay Defne merkezli MAY Enerji ve Yazılım; güneş enerji sistemleri montajı, kurulumu ve satışını mühendislik ve yazılım disiplinini birleştirerek yürütür.",
};

export default async function Hakkimizda() {
  const ayar = await ayarlariGetir();

  return (
    <>
      <SayfaBasligi
        etiket="Hakkımızda"
        baslik="Enerji mühendisliğini yazılımla birleştiriyoruz"
        aciklama="MAY Enerji ve Yazılım, Hatay Defne merkezli olarak ev, iş yeri, sanayi tesisi ve tarımsal alanlara güneş enerji sistemleri kuran bir enerji ve teknoloji şirketidir."
      />

      <section className="bg-white py-20">
        <div className="kapsayici grid items-start gap-14 lg:grid-cols-2">
          <div className="space-y-5 text-slate-600">
            <span className="etiket">Biz kimiz?</span>
            <h2 className="baslik-bolum">Güneşi bir ürün değil, bir yatırım olarak anlatıyoruz</h2>
            <p className="leading-relaxed">
              Türkiye&apos;de güneş enerjisi sektörünün en büyük sorunu, müşterinin ne aldığını tam
              olarak bilmemesi. Kaç kilovat gerektiği, panelin gerçekte ne kadar ürettiği, yatırımın
              kaç yılda döndüğü çoğu zaman muğlak kalıyor. Biz bu belirsizliği ortadan kaldırmak için
              yola çıktık.
            </p>
            <p className="leading-relaxed">
              Her projeye ölçümle başlıyoruz. Faturanızı inceliyor, tüketim profilinizi çıkarıyor,
              çatınızın yönünü ve gölgelenmesini yerinde değerlendiriyoruz. Ardından size sadece bir
              fiyat değil; kaç kWp, kaç panel, yılda kaç kWh üretim ve kaç yıl amortisman anlamına
              geldiğini rakamlarla anlatıyoruz.
            </p>
            <p className="leading-relaxed">
              Adımızdaki &quot;yazılım&quot; kısmı bir süs değil. Kurduğumuz sistemleri dijital olarak izliyor,
              üretim verilerini takip ediyor, verim düşüşünü müşterimiz fark etmeden biz görüyoruz.
              Birden fazla tesisi olan işletmeler için tüm santralleri tek ekranda toplayan özel
              raporlama panelleri geliştiriyoruz.
            </p>
            <p className="leading-relaxed">
              Hatay merkezliyiz ve bunu bir avantaj olarak görüyoruz. Bölgemiz Türkiye&apos;nin en yüksek
              güneşlenme değerlerine sahip illerinden biri; ayrıca yerel olmamız sayesinde bir arıza
              durumunda başka şehirden servis beklemiyorsunuz.
            </p>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl bg-slate-50 p-8">
              <Image src="/logo.jpeg" alt="MAY Enerji ve Yazılım" width={200} height={200}
                className="mx-auto rounded-2xl bg-white p-4 shadow-sm" />
              <div className="mt-8 space-y-4 text-sm">
                {[
                  ["konum", "Merkez", ayar.adres_detay],
                  ["mail", "E-posta", ayar.eposta],
                  ["telefon", "Telefon", ayar.telefon],
                  ["saat", "Çalışma saatleri", ayar.calisma_saati],
                ].map(([ikon, k, v]) => (
                  <div key={k} className="flex gap-3">
                    <Ikon ad={ikon} className="h-5 w-5 shrink-0 text-yesil" />
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">{k}</p>
                      <p className="font-medium text-lacivert">{v}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border-2 border-yesil-100 bg-yesil-100/40 p-8">
              <h3 className="font-bold text-lacivert">Hizmet verdiğimiz bölgeler</h3>
              <p className="mt-3 text-sm text-slate-600">
                Merkezimiz Hatay Defne&apos;de. Aktif olarak şu illerde kurulum yapıyoruz:
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {["Hatay", "Adana", "Osmaniye", "Gaziantep", "Kilis", "Mersin", "Kahramanmaraş"].map((il) => (
                  <span key={il} className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-yesil-700 shadow-sm">
                    {il}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-20">
        <div className="kapsayici">
          <div className="mx-auto max-w-2xl text-center">
            <span className="etiket">Değerlerimiz</span>
            <h2 className="baslik-bolum mt-5">Çalışma prensiplerimiz</h2>
          </div>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {[
              { ikon: "hesap", ad: "Ölçmeden söz vermeyiz", metin: "Keşif yapmadan, faturayı görmeden kapasite ve fiyat söylemiyoruz. Sitemizdeki hesaplayıcı bir ön fikirdir; kesin rakam ölçümle çıkar." },
              { ikon: "kalkan", ad: "Tek muhatap", metin: "Proje, evrak, montaj ve devreye alma tek sözleşmede. Müşterimizi taşerondan taşerona göndermiyoruz." },
              { ikon: "cuzdan", ad: "Şeffaf fiyat", metin: "Hangi panel, hangi inverter, hangi konstrüksiyon ve ne kadar işçilik — teklifimizde kalem kalem yazar." },
              { ikon: "izleme", ad: "Kurulum bitiş değil başlangıç", metin: "Sistemi devreye aldıktan sonra üretim verisini izlemeye devam ediyor, düşüş olduğunda müdahale ediyoruz." },
              { ikon: "yaprak", ad: "Doğru kapasite", metin: "Gereğinden büyük sistem satmak kolaydır. Biz ihtiyacınıza uyan, geri dönüşü en hızlı kapasiteyi öneriyoruz." },
              { ikon: "gunes", ad: "Uzun ömür", metin: "En ucuz malzemeyle değil, 25 yıl sorunsuz çalışacak malzemeyle kuruyoruz. Ucuz kurulum pahalıya patlar." },
            ].map((d) => (
              <div key={d.ad} className="kart">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-lacivert-100 text-lacivert">
                  <Ikon ad={d.ikon} className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-bold text-lacivert">{d.ad}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{d.metin}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link href="/iletisim" className="btn-birincil !px-7 !py-4">Bizimle çalışmak için iletişime geçin</Link>
          </div>
        </div>
      </section>
    </>
  );
}
