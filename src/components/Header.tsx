"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";

const MENU = [
  { href: "/", ad: "Ana Sayfa" },
  { href: "/hizmetler", ad: "Hizmetlerimiz" },
  { href: "/hesaplama", ad: "Fiyat Hesapla" },
  { href: "/projeler", ad: "Projelerimiz" },
  { href: "/hakkimizda", ad: "Hakkımızda" },
  { href: "/sss", ad: "S.S.S." },
  { href: "/iletisim", ad: "İletişim" },
];

export default function Header({ ayar }: { ayar: Record<string, string> }) {
  const [acik, setAcik] = useState(false);
  const yol = usePathname();

  return (
    <>
      {/* Üst bilgi çubuğu */}
      <div className="hidden bg-lacivert-900 text-white md:block">
        <div className="kapsayici flex h-10 items-center justify-between text-xs">
          <div className="flex items-center gap-6">
            <span>{ayar.adres_detay}</span>
            <a href={`mailto:${ayar.eposta}`} className="hover:text-gunes">{ayar.eposta}</a>
          </div>
          <div className="flex items-center gap-6">
            <span className="text-slate-300">{ayar.calisma_saati}</span>
            <a href={`tel:${ayar.telefon.replace(/\s/g, "")}`} className="font-semibold text-gunes">
              {ayar.telefon}
            </a>
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="kapsayici flex h-20 items-center justify-between gap-4">
          <Link href="/" className="flex shrink-0 items-center gap-3">
            <Image src="/logo.jpeg" alt="MAY Enerji ve Yazılım" width={56} height={56}
              className="h-14 w-14 rounded-lg object-contain" priority />
            <span className="hidden leading-tight sm:block">
              <span className="block text-lg font-extrabold tracking-tight text-lacivert">MAY</span>
              <span className="block text-[10px] font-bold uppercase tracking-[0.18em] text-yesil">
                Enerji ve Yazılım
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {MENU.map((m) => {
              const aktif = yol === m.href;
              return (
                <Link key={m.href} href={m.href}
                  className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                    aktif ? "bg-yesil-100 text-yesil-700" : "text-lacivert hover:bg-slate-100"
                  }`}>
                  {m.ad}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <Link href="/hesaplama" className="btn-birincil hidden !px-4 !py-2.5 md:inline-flex">
              Ücretsiz Keşif
            </Link>
            <button onClick={() => setAcik(!acik)} aria-label="Menü"
              className="rounded-lg p-2 text-lacivert hover:bg-slate-100 lg:hidden">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                {acik
                  ? <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />}
              </svg>
            </button>
          </div>
        </div>

        {acik && (
          <nav className="border-t border-slate-200 bg-white lg:hidden">
            <div className="kapsayici flex flex-col py-3">
              {MENU.map((m) => (
                <Link key={m.href} href={m.href} onClick={() => setAcik(false)}
                  className="rounded-lg px-3 py-3 text-sm font-semibold text-lacivert hover:bg-slate-100">
                  {m.ad}
                </Link>
              ))}
              <a href={`tel:${ayar.telefon.replace(/\s/g, "")}`} className="btn-birincil mt-3">
                {ayar.telefon} — Hemen Ara
              </a>
            </div>
          </nav>
        )}
      </header>
    </>
  );
}
