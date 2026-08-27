import Link from "next/link";

export default function NotFound() {
  return (
    <section className="kapsayici flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="text-7xl font-extrabold text-yesil">404</p>
      <h1 className="mt-5 text-2xl font-bold text-lacivert">Aradığınız sayfa bulunamadı</h1>
      <p className="mt-3 max-w-md text-slate-600">
        Sayfa taşınmış ya da adres yanlış yazılmış olabilir. Ana sayfadan devam edebilirsiniz.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn-birincil">Ana sayfa</Link>
        <Link href="/hesaplama" className="btn-cerceve">Fiyat hesapla</Link>
      </div>
    </section>
  );
}
