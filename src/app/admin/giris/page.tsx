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

  async function girisYap(e: React.FormEvent) {
    e.preventDefault();
    setYukleniyor(true); setHata("");
    const { error } = await supabaseBrowser().auth.signInWithPassword({ email: eposta, password: sifre });
    if (error) {
      setHata("E-posta veya şifre hatalı.");
      setYukleniyor(false);
      return;
    }
    router.push("/admin");
    router.refresh();
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
