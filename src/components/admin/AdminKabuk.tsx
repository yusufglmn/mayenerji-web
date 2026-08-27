"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase/client";

const MENU = [
  { href: "/admin", ad: "Genel Bakış", ikon: "M3 12l9-9 9 9M5 10v10h14V10" },
  { href: "/admin/talepler", ad: "Teklif Talepleri", ikon: "M2 6l10 7L22 6M2 6h20v12H2z" },
  { href: "/admin/projeler", ad: "Projeler & Fotoğraflar", ikon: "M3 5h18v14H3zM3 15l5-5 4 4 3-3 6 6" },
  { href: "/admin/fiyatlar", ad: "Fiyat & Hesaplama", ikon: "M6 3h12v18H6zM9 7h6M9 11h6M9 15h3" },
  { href: "/admin/ayarlar", ad: "Site Ayarları", ikon: "M12 15a3 3 0 100-6 3 3 0 000 6zM19 12l2 1-2 4-2-1-2 1-1 2h-4l-1-2-2-1-2 1-2-4 2-1v-2l-2-1 2-4 2 1 2-1 1-2h4l1 2 2 1 2-1 2 4-2 1z" },
];

export default function AdminKabuk({ children }: { children: React.ReactNode }) {
  const yol = usePathname();
  const router = useRouter();
  const girisEkrani = yol === "/admin/giris";

  async function cikis() {
    await supabaseBrowser().auth.signOut();
    router.push("/admin/giris");
    router.refresh();
  }

  if (girisEkrani) return <>{children}</>;

  return (
    <div className="flex min-h-screen bg-slate-100">
      <aside className="hidden w-64 shrink-0 flex-col bg-lacivert-900 text-slate-300 lg:flex">
        <div className="flex items-center gap-3 border-b border-white/10 px-6 py-5">
          <Image src="/logo.jpeg" alt="MAY" width={40} height={40} className="h-10 w-10 rounded-lg bg-white object-contain" />
          <div className="leading-tight">
            <p className="text-sm font-extrabold text-white">MAY Enerji</p>
            <p className="text-[10px] uppercase tracking-widest text-yesil-400">Yönetim</p>
          </div>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          {MENU.map((m) => {
            const aktif = yol === m.href;
            return (
              <Link key={m.href} href={m.href}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                  aktif ? "bg-yesil text-white" : "hover:bg-white/10"}`}>
                <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={m.ikon} />
                </svg>
                {m.ad}
              </Link>
            );
          })}
        </nav>
        <div className="space-y-2 border-t border-white/10 p-4">
          <Link href="/" target="_blank" className="block rounded-xl px-4 py-2.5 text-sm hover:bg-white/10">
            ↗ Siteyi görüntüle
          </Link>
          <button onClick={cikis} className="w-full rounded-xl px-4 py-2.5 text-left text-sm text-red-300 hover:bg-white/10">
            Çıkış yap
          </button>
        </div>
      </aside>

      <div className="flex-1">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-3 lg:hidden">
          <span className="font-extrabold text-lacivert">MAY Yönetim</span>
          <button onClick={cikis} className="text-sm font-semibold text-red-600">Çıkış</button>
        </header>
        <nav className="flex gap-1 overflow-x-auto border-b border-slate-200 bg-white px-3 py-2 lg:hidden">
          {MENU.map((m) => (
            <Link key={m.href} href={m.href}
              className={`whitespace-nowrap rounded-lg px-3 py-2 text-xs font-semibold ${
                yol === m.href ? "bg-yesil text-white" : "text-slate-600"}`}>
              {m.ad}
            </Link>
          ))}
        </nav>
        <div className="p-5 lg:p-8">{children}</div>
      </div>
    </div>
  );
}
