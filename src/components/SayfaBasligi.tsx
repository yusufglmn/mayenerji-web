export default function SayfaBasligi({ etiket, baslik, aciklama }: { etiket: string; baslik: string; aciklama: string }) {
  return (
    <section className="relative overflow-hidden bg-lacivert-900 py-16 sm:py-20">
      <div className="absolute inset-0 opacity-25"
        style={{ backgroundImage: "radial-gradient(circle at 85% 25%, #F5A623 0%, transparent 40%), radial-gradient(circle at 10% 80%, #2E7D32 0%, transparent 40%)" }} />
      <div className="kapsayici relative max-w-3xl">
        <span className="etiket bg-white/10 text-gunes">{etiket}</span>
        <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">{baslik}</h1>
        <p className="mt-5 text-lg leading-relaxed text-slate-300">{aciklama}</p>
      </div>
    </section>
  );
}
