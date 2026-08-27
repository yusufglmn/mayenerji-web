import Link from "next/link";
import { supabaseServer } from "@/lib/supabase/server";
import { tarihSaat, tl } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminAnaSayfa() {
  const sb = await supabaseServer();

  const [talep, mesaj, proje, yeniTalep] = await Promise.all([
    sb.from("talepler").select("*", { count: "exact", head: true }),
    sb.from("mesajlar").select("*", { count: "exact", head: true }).eq("okundu", false),
    sb.from("projeler").select("*", { count: "exact", head: true }),
    sb.from("talepler").select("*").order("olusturuldu", { ascending: false }).limit(6),
  ]);

  const kartlar = [
    { ad: "Toplam teklif talebi", deger: talep.count ?? 0, href: "/admin/talepler", renk: "bg-yesil-100 text-yesil-700" },
    { ad: "Okunmamış mesaj", deger: mesaj.count ?? 0, href: "/admin/talepler", renk: "bg-gunes-100 text-gunes-600" },
    { ad: "Yayındaki proje", deger: proje.count ?? 0, href: "/admin/projeler", renk: "bg-lacivert-100 text-lacivert" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-lacivert">Genel Bakış</h1>
        <p className="mt-1.5 text-sm text-slate-600">Sitenizin güncel durumu ve son gelen talepler.</p>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        {kartlar.map((k) => (
          <Link key={k.ad} href={k.href} className="rounded-2xl bg-white p-6 shadow-sm transition hover:shadow-md">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">{k.ad}</p>
            <p className={`mt-3 inline-flex rounded-xl px-4 py-2 text-3xl font-extrabold ${k.renk}`}>{k.deger}</p>
          </Link>
        ))}
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-lacivert">Son teklif talepleri</h2>
          <Link href="/admin/talepler" className="text-sm font-semibold text-yesil hover:underline">Tümü →</Link>
        </div>
        {(yeniTalep.data?.length ?? 0) === 0 ? (
          <p className="mt-5 rounded-xl bg-slate-50 px-5 py-8 text-center text-sm text-slate-500">
            Henüz talep gelmemiş. Site yayına girdikten sonra hesaplayıcıdan gelen talepler burada listelenir.
          </p>
        ) : (
          <div className="mt-5 overflow-x-auto">
            <table className="tablo">
              <thead>
                <tr><th>Tarih</th><th>Ad Soyad</th><th>Telefon</th><th>Segment</th><th>Güç</th><th>Maliyet</th><th>Durum</th></tr>
              </thead>
              <tbody>
                {yeniTalep.data!.map((t) => {
                  const s = (t.sonuc ?? {}) as Record<string, number>;
                  return (
                    <tr key={t.id}>
                      <td className="whitespace-nowrap text-xs text-slate-500">{tarihSaat(t.olusturuldu)}</td>
                      <td className="font-semibold text-lacivert">{t.ad_soyad}</td>
                      <td className="whitespace-nowrap">{t.telefon}</td>
                      <td className="text-xs">{t.segment}</td>
                      <td className="whitespace-nowrap text-xs">{s.onerilenKwp ?? "—"} kWp</td>
                      <td className="whitespace-nowrap text-xs">{s.maliyetTl ? tl(s.maliyetTl) : "—"}</td>
                      <td>
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold uppercase text-slate-600">
                          {t.durum}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["Yeni proje ekle", "Tamamladığınız kurulumun fotoğraflarını yayınlayın", "/admin/projeler"],
          ["Fiyatları güncelle", "kWp birim fiyatı ve elektrik tarifelerini düzenleyin", "/admin/fiyatlar"],
          ["Site bilgileri", "Telefon, adres, WhatsApp ve sosyal medya", "/admin/ayarlar"],
          ["Talepleri yönet", "Gelen teklif taleplerini ve mesajları görün", "/admin/talepler"],
        ].map(([ad, aciklama, href]) => (
          <Link key={ad} href={href} className="rounded-2xl border-2 border-dashed border-slate-300 bg-white p-5 transition hover:border-yesil hover:shadow-sm">
            <p className="font-bold text-lacivert">{ad}</p>
            <p className="mt-1.5 text-xs leading-relaxed text-slate-500">{aciklama}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
