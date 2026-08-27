"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { supabaseBrowser } from "@/lib/supabase/client";

export default function Giris() {
  const [eposta, setEposta] = useState("");
  const [sifre, setSifre] = useState("");
  const [hata, setHata] = useState("");
  const [yukleniyor, setYukleniyor] = useState(false);
  const router = useRouter();

  /** Supabase'in teknik hatasını anlaşılır Türkçeye çevirir. */
  function hataMetni(mesaj: string): string {
    const m = mesaj.toLowerCase();
    if (m.includes("invalid login")) return "E-posta veya şifre hatalı.";
    if (m.includes("email not confirmed"))
      return "Bu kullanıcı henüz doğrulanmamış. Supabase > Authentication > Users bölümünden kullanıcıyı 'Auto Confirm User' işaretli olarak yeniden oluşturun.";
    if (m.includes("invalid api key") || m.includes("api key"))
      return "Supabase anahtarı geçersiz. Vercel'deki NEXT_PUBLIC_SUPABASE_ANON_KEY değerini kontrol edin.";
    if (m.includes("failed to fetch") || m.includes("networkerror") || m.includes("load failed"))
      return "Supabase'e bağlanılamadı. NEXT_PUBLIC_SUPABASE_URL değeri eksik veya hatalı olabilir.";
    if (m.includes("rate limit") || m.includes("too many"))
      return "Çok fazla deneme yapıldı. Birkaç dakika bekleyip tekrar deneyin.";
    return `Giriş yapılamadı: ${mesaj}`;
  }

  async function girisYap(e: React.FormEvent) {
    e.preventDefault();
    setYukleniyor(true); setHata("");

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      setHata("Supabase bağlantı bilgileri tanımlı değil. Vercel > Settings > Environment Variables bölümünü kontrol edip yeniden yayınlayın (Redeploy).");
      setYukleniyor(false);
      return;
    }

    try {
      const { error } = await supabaseBrowser().auth.signInWithPassword({
        email: eposta.trim(),
        password: sifre,
      });
      if (error) {
        setHata(hataMetni(error.message));
        setYukleniyor(false);
        return;
      }
      router.push("/admin");
      router.refresh();
    } catch (err) {
      setHata(hataMetni(err instanceof Error ? err.message : String(err)));
      setYukleniyor(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-lacivert-900 px-5">
      <div className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-2xl">
        <Image src="/logo.jpeg" alt="MAY Enerji" width={72} height={72} className="mx-auto h-18 w-18 rounded-xl object-contain" />
        <h1 className="mt-6 text-center text-xl font-bold text-lacivert">Yönetim Paneli</h1>
        <p className="mt-1.5 text-center text-sm text-slate-500">Devam etmek için giriş yapın</p>

        <form onSubmit={girisYap} className="mt-8 space-y-4">
          <div>
            <label className="etiket-form" htmlFor="e">E-posta</label>
            <input id="e" type="email" required value={eposta} onChange={(e) => setEposta(e.target.value)}
              className="girdi" placeholder="info@mayenerjiyazilim.com" autoComplete="username" />
          </div>
          <div>
            <label className="etiket-form" htmlFor="s">Şifre</label>
            <input id="s" type="password" required value={sifre} onChange={(e) => setSifre(e.target.value)}
              className="girdi" placeholder="••••••••" autoComplete="current-password" />
          </div>
          {hata && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{hata}</p>}
          <button type="submit" disabled={yukleniyor} className="btn-birincil w-full !py-3.5 disabled:opacity-60">
            {yukleniyor ? "Giriş yapılıyor…" : "Giriş yap"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs leading-relaxed text-slate-400">
          Kullanıcı hesabı Supabase &gt; Authentication &gt; Users bölümünden oluşturulur.
        </p>
      </div>
    </div>
  );
}
