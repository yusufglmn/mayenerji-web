import Link from "next/link";
import Image from "next/image";
import { Ikon } from "./Ikon";

export default function Footer({ ayar }: { ayar: Record<string, string> }) {
  const yil = new Date().getFullYear();
  const sosyal = [
    { ad: "Instagram", href: ayar.instagram },
    { ad: "Facebook", href: ayar.facebook },
    { ad: "LinkedIn", href: ayar.linkedin },
  ].filter((s) => s.href);

  return (
    <footer className="bg-lacivert-900 text-slate-300">
      <div className="kapsayici grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-3">
            <Image src="/logo.jpeg" alt="MAY Enerji ve Yazılım" width={52} height={52}
              className="h-13 w-13 rounded-lg bg-white object-contain p-0.5" />
            <span className="leading-tight">
              <span className="block text-lg font-extrabold text-white">MAY</span>
              <span className="block text-[10px] font-bold uppercase tracking-[0.18em] text-yesil-400">
                Enerji ve Yazılım
              </span>
            </span>
          </div>
          <p className="mt-5 text-sm leading-relaxed">
            Hatay ve çevre illerde ev, iş yeri, sanayi tesisi ve tarımsal alanlara anahtar teslim
            güneş enerji sistemleri kuruyoruz. Keşiften devreye almaya kadar tüm süreç bizde.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-white">Hizmetlerimiz</h3>
          <ul className="mt-5 space-y-2.5 text-sm">
            {[
              ["/hizmetler", "Konut Çatı GES"],
              ["/hizmetler", "İş Yeri ve Esnaf GES"],
              ["/hizmetler", "Sanayi ve Fabrika GES"],
              ["/hizmetler", "Tarımsal Sulama GES"],
              ["/hizmetler", "Hibrit ve Depolama"],
              ["/hizmetler", "Bakım ve İzleme"],
            ].map(([h, a], i) => (
              <li key={i}><Link href={h} className="hover:text-gunes">{a}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-white">Kurumsal</h3>
          <ul className="mt-5 space-y-2.5 text-sm">
            {[
              ["/hakkimizda", "Hakkımızda"],
              ["/projeler", "Tamamlanan Projeler"],
              ["/hesaplama", "Ücretsiz Fiyat Hesaplama"],
              ["/sss", "Sıkça Sorulan Sorular"],
              ["/iletisim", "İletişim"],
            ].map(([h, a]) => (
              <li key={h + a}><Link href={h} className="hover:text-gunes">{a}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-white">İletişim</h3>
          <ul className="mt-5 space-y-4 text-sm">
            <li className="flex gap-3">
              <Ikon ad="konum" className="h-5 w-5 shrink-0 text-yesil-400" />
              <span>{ayar.adres_detay}</span>
            </li>
            <li className="flex gap-3">
              <Ikon ad="telefon" className="h-5 w-5 shrink-0 text-yesil-400" />
              <a href={`tel:${ayar.telefon.replace(/\s/g, "")}`} className="hover:text-gunes">{ayar.telefon}</a>
            </li>
            <li className="flex gap-3">
              <Ikon ad="mail" className="h-5 w-5 shrink-0 text-yesil-400" />
              <a href={`mailto:${ayar.eposta}`} className="break-all hover:text-gunes">{ayar.eposta}</a>
            </li>
            <li className="flex gap-3">
              <Ikon ad="saat" className="h-5 w-5 shrink-0 text-yesil-400" />
              <span>{ayar.calisma_saati}</span>
            </li>
          </ul>
          {sosyal.length > 0 && (
            <div className="mt-5 flex gap-3">
              {sosyal.map((s) => (
                <a key={s.ad} href={s.href} target="_blank" rel="noopener noreferrer"
                  className="rounded-lg bg-white/10 px-3 py-1.5 text-xs font-semibold hover:bg-yesil">
                  {s.ad}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="kapsayici flex flex-col items-center justify-between gap-3 py-5 text-xs sm:flex-row">
          <p>© {yil} MAY Enerji ve Yazılım. Tüm hakları saklıdır.</p>
          <p className="text-slate-400">
            Hesaplama aracındaki değerler tahminidir; kesin fiyat keşif sonrası belirlenir.
          </p>
        </div>
      </div>
    </footer>
  );
}
