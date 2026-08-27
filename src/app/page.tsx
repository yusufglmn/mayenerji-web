import Link from "next/link";
import Image from "next/image";
import { Ikon } from "@/components/Ikon";
import { ayarlariGetir, hizmetleriGetir, projeleriGetir, sssGetir } from "@/lib/data";
import { sayi } from "@/lib/format";

export default async function AnaSayfa() {
  const [ayar, hizmetler, projeler, sss] = await Promise.all([
    ayarlariGetir(), hizmetleriGetir(), projeleriGetir(true), sssGetir(),
  ]);

  return (
    <>
      {/* ---------------- HERO ---------------- */}
      <section className="relative overflow-hidden bg-lacivert-900">
        <div className="absolute inset-0 opacity-30"
          style={{ backgroundImage: "radial-gradient(circle at 80% 20%, #F5A623 0%, transparent 45%), radial-gradient(circle at 15% 85%, #2E7D32 0%, transparent 45%)" }} />
        <div className="kapsayici relative grid items-center gap-12 py-20 lg:grid-cols-2 lg:py-28">
          <div>
            <span className="etiket bg-gunes-100 text-gunes-600">
              <Ikon ad="gunes" className="h-4 w-4" /> Hatay ve çevre illere hizmet
            </span>
            <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              Elektrik faturanızı <span className="text-gunes">güneşe</span> ödeyin,{" "}
              <span className="text-yesil-400">şebekeye</span> değil.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-300">
              Eviniz, iş yeriniz, fabrikanız veya tarımsal araziniz için anahtar teslim güneş enerji
              sistemleri kuruyoruz. Keşiften projeye, montajdan dağıtım şirketi başvurusuna kadar
              her adımı biz yürütüyoruz.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/hesaplama" className="btn-gunes !px-7 !py-4 text-base">
                <Ikon ad="hesap" className="h-5 w-5" /> Fiyatımı Hesapla
              </Link>
              <Link href="/iletisim" className="btn !border-2 !border-white/40 !py-4 !px-7 text-base text-white hover:bg-white hover:text-lacivert">
                Ücretsiz Keşif İste
              </Link>
            </div>

            <dl className="mt-12 grid grid-cols-3 gap-6 border-t border-white/15 pt-8">
              {[
                ["25+ yıl", "Panel garantisi"],
                ["3–6 yıl", "Ortalama amortisman"],
                ["%100", "Anahtar teslim"],
              ].map(([b, a]) => (
                <div key={a}>
                  <dt className="text-2xl font-extrabold text-gunes sm:text-3xl">{b}</dt>
                  <dd className="mt-1 text-xs text-slate-400 sm:text-sm">{a}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative hidden justify-center lg:flex">
            <div className="absolute h-80 w-80 rounded-full bg-gunes/20 blur-3xl" />
            <Image src="/logo.jpeg" alt="MAY Enerji ve Yazılım logosu" width={420} height={420}
              className="relative rounded-3xl bg-white p-6 shadow-2xl" priority />
          </div>
        </div>
      </section>

      {/* ---------------- SEGMENTLER ---------------- */}
      <section className="bg-white py-20">
        <div className="kapsayici">
          <div className="mx-auto max-w-2xl text-center">
            <span className="etiket">Kimlere kuruyoruz?</span>
            <h2 className="baslik-bolum mt-5">Her ölçekte güneş enerjisi çözümü</h2>
            <p className="alt-baslik">
              Tek daireden megavat ölçeğinde arazi santraline kadar; tüketim profilinizi ölçer,
              size özel kapasiteyi belirleriz.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { ikon: "ev", ad: "Evler", metin: "Müstakil ev, villa, apartman dairesi ve site ortak alanları için 3–20 kWp arası çatı sistemleri.", ozellik: ["Fatura sıfırlama", "Kiremit & teras çatı", "Çift yönlü sayaç"] },
              { ikon: "dukkan", ad: "Esnaf & İş Yerleri", metin: "Market, kafe, restoran, otel, ofis, oto yıkama ve berberler için gündüz tüketimine göre tasarım.", ozellik: ["Yüksek öz tüketim", "Hızlı amortisman", "Ticarethane tarifesi"] },
              { ikon: "fabrika", ad: "Sanayi Tesisleri", metin: "Fabrika, imalathane, soğuk hava deposu ve atölyeler için 100 kWp–1 MW arası kurulumlar.", ozellik: ["Trafo analizi", "Yük profili etüdü", "SCADA entegrasyonu"] },
              { ikon: "tarim", ad: "Tarımsal Alanlar", metin: "Sulama tesisleri, seralar, besi ve süt çiftlikleri için çatı ve arazi tipi GES çözümleri.", ozellik: ["Sulama pompası", "Arazi konstrüksiyon", "Hibe danışmanlığı"] },
            ].map((s) => (
              <div key={s.ad} className="kart-hover">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yesil-100 text-yesil-700">
                  <Ikon ad={s.ikon} className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-lg font-bold text-lacivert">{s.ad}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-slate-600">{s.metin}</p>
                <ul className="mt-4 space-y-2">
                  {s.ozellik.map((o) => (
                    <li key={o} className="flex items-center gap-2 text-xs font-medium text-slate-500">
                      <Ikon ad="onay" className="h-4 w-4 shrink-0 text-yesil" /> {o}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- HESAPLAMA CTA ---------------- */}
      <section className="bg-lacivert py-20">
        <div className="kapsayici grid items-center gap-12 lg:grid-cols-2">
          <div>
            <span className="etiket bg-white/10 text-gunes">Online hesaplama</span>
            <h2 className="mt-5 text-3xl font-bold text-white sm:text-4xl">
              2 dakikada tahmini fiyatınızı öğrenin
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-slate-300">
              Elektrik faturanızı girin ya da kullandığınız cihazları işaretleyin — sistem size
              gereken kurulu gücü, panel sayısını, tahmini maliyet aralığını ve yatırımın kaç yılda
              kendini ödeyeceğini anında göstersin.
            </p>
            <ul className="mt-8 space-y-3">
              {[
                "Faturanızdan, tüketiminizden veya cihaz listesinden hesaplama",
                "Ev, esnaf, sanayi ve tarımsal alan için ayrı tarife modelleri",
                "Çatı veya arazi alanınıza göre kapasite sınırlama",
                "Amortisman süresi ve 25 yıllık toplam kazanç projeksiyonu",
              ].map((m) => (
                <li key={m} className="flex gap-3 text-sm text-slate-200">
                  <Ikon ad="onay" className="h-5 w-5 shrink-0 text-yesil-400" /> {m}
                </li>
              ))}
            </ul>
            <Link href="/hesaplama" className="btn-gunes mt-9 !px-7 !py-4 text-base">
              Hesaplamayı Başlat <Ikon ad="ok" className="h-5 w-5" />
            </Link>
          </div>

          <div className="rounded-3xl bg-white p-8 shadow-2xl">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Örnek sonuç</p>
            <p className="mt-1 text-sm text-slate-500">Hatay&apos;da 4.500 ₺ aylık faturası olan bir ev</p>
            <div className="mt-6 space-y-4">
              {[
                ["Önerilen sistem gücü", "10,54 kWp"],
                ["Panel sayısı", "17 adet × 620 W"],
                ["Tahmini maliyet", "283.000 – 350.000 ₺"],
                ["Yıllık tasarruf", "~ 56.000 ₺"],
                ["Amortisman süresi", "5,2 yıl"],
              ].map(([k, v], i) => (
                <div key={k} className={`flex items-center justify-between ${i === 4 ? "rounded-xl bg-yesil-100 px-4 py-3" : "border-b border-slate-100 pb-3"}`}>
                  <span className="text-sm text-slate-600">{k}</span>
                  <span className={`font-bold ${i === 4 ? "text-yesil-700" : "text-lacivert"}`}>{v}</span>
                </div>
              ))}
            </div>
            <p className="mt-5 text-[11px] leading-relaxed text-slate-400">
              Değerler örnektir. Gerçek sonuç çatı yönü, gölgelenme ve tüketim profiline göre değişir.
            </p>
          </div>
        </div>
      </section>

      {/* ---------------- HİZMETLER ---------------- */}
      <section className="bg-slate-50 py-20">
        <div className="kapsayici">
          <div className="mx-auto max-w-2xl text-center">
            <span className="etiket">Ne yapıyoruz?</span>
            <h2 className="baslik-bolum mt-5">Hizmetlerimiz</h2>
            <p className="alt-baslik">
              Sadece panel satmıyoruz; projelendirme, montaj, resmi süreç ve satış sonrası bakımı
              tek elden yürütüyoruz.
            </p>
          </div>
          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {hizmetler.map((h) => (
              <div key={h.id} className="kart-hover">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-lacivert-100 text-lacivert">
                  <Ikon ad={h.ikon} className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-lg font-bold text-lacivert">{h.baslik}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-slate-600">{h.ozet}</p>
                <Link href="/hizmetler" className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-yesil hover:gap-2.5 transition-all">
                  Detaylı bilgi <Ikon ad="ok" className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- SÜREÇ ---------------- */}
      <section className="bg-white py-20">
        <div className="kapsayici">
          <div className="mx-auto max-w-2xl text-center">
            <span className="etiket">Nasıl çalışıyoruz?</span>
            <h2 className="baslik-bolum mt-5">Keşiften devreye almaya 5 adım</h2>
          </div>
          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
            {[
              ["Ücretsiz keşif", "Çatınızı veya arazinizi yerinde ölçer, gölge analizi yapar, faturanızı inceleriz."],
              ["Projelendirme", "Size özel kapasite, panel yerleşimi, inverter seçimi ve net fiyat teklifi hazırlarız."],
              ["Resmi süreç", "Dağıtım şirketine başvuru, çağrı mektubu ve proje onayı süreçlerini biz takip ederiz."],
              ["Montaj", "Konstrüksiyon, panel ve inverter montajı, DC-AC kablolama ve pano işlerini tamamlarız."],
              ["Devreye alma", "Çift yönlü sayaç bağlanır, sistem test edilir, uzaktan izleme paneliniz teslim edilir."],
            ].map((a, i) => (
              <div key={a[0]} className="relative">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-yesil text-base font-extrabold text-white">
                  {i + 1}
                </div>
                <h3 className="mt-4 font-bold text-lacivert">{a[0]}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{a[1]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- PROJELER ---------------- */}
      {projeler.length > 0 && (
        <section className="bg-slate-50 py-20">
          <div className="kapsayici">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <span className="etiket">Referanslarımız</span>
                <h2 className="baslik-bolum mt-5">Tamamladığımız projeler</h2>
              </div>
              <Link href="/projeler" className="btn-cerceve">Tümünü gör</Link>
            </div>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {projeler.slice(0, 6).map((p) => (
                <article key={p.id} className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-lg">
                  {p.kapak_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.kapak_url} alt={p.baslik} className="h-52 w-full object-cover transition group-hover:scale-105" />
                  ) : (
                    <div className="flex h-52 items-center justify-center bg-lacivert-100 text-lacivert">
                      <Ikon ad="gunes" className="h-12 w-12" />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex flex-wrap gap-2 text-[11px] font-bold uppercase tracking-wide">
                      {p.konum && <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-600">{p.konum}</span>}
                      {p.guc_kwp && <span className="rounded-full bg-gunes-100 px-2.5 py-1 text-gunes-600">{sayi(p.guc_kwp, 2)} kWp</span>}
                    </div>
                    <h3 className="mt-3 text-lg font-bold text-lacivert">{p.baslik}</h3>
                    <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-600">{p.ozet}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ---------------- NEDEN BİZ ---------------- */}
      <section className="bg-white py-20">
        <div className="kapsayici grid gap-12 lg:grid-cols-2">
          <div>
            <span className="etiket">Neden MAY Enerji?</span>
            <h2 className="baslik-bolum mt-5">Mühendislik ve yazılım aynı çatı altında</h2>
            <p className="alt-baslik">
              Adımızdaki &quot;yazılım&quot; sadece bir kelime değil. Kurduğumuz her sistemi dijital olarak
              izliyor, verim düşüşünü siz fark etmeden biz görüyoruz. Çok tesisli işletmelere özel
              raporlama panelleri geliştiriyoruz.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            {[
              { ikon: "kalkan", ad: "Anahtar teslim sorumluluk", metin: "Keşif, proje, evrak, montaj ve devreye alma tek sözleşmede. Aracı yok, muhatap tek." },
              { ikon: "hesap", ad: "Şeffaf fiyatlandırma", metin: "Hangi panelin, hangi inverterin ve hangi işçiliğin ne tuttuğunu kalem kalem gösteriyoruz." },
              { ikon: "izleme", ad: "Uzaktan izleme", metin: "Telefonunuzdan anlık üretim, tasarruf ve arıza uyarısı. Verim düşünce sizi biz arıyoruz." },
              { ikon: "yaprak", ad: "Yerel ve ulaşılabilir", metin: "Hatay merkezliyiz. Arıza olduğunda başka şehirden servis beklemiyorsunuz." },
            ].map((k) => (
              <div key={k.ad} className="kart">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gunes-100 text-gunes-600">
                  <Ikon ad={k.ikon} className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-bold text-lacivert">{k.ad}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{k.metin}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- SSS ---------------- */}
      <section className="bg-slate-50 py-20">
        <div className="kapsayici max-w-3xl">
          <div className="text-center">
            <span className="etiket">Merak edilenler</span>
            <h2 className="baslik-bolum mt-5">Sıkça sorulan sorular</h2>
          </div>
          <div className="mt-12 space-y-3">
            {sss.slice(0, 5).map((s) => (
              <details key={s.id} className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold text-lacivert">
                  {s.soru}
                  <span className="shrink-0 text-2xl font-normal text-yesil transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-4 text-sm leading-relaxed text-slate-600">{s.cevap}</p>
              </details>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/sss" className="btn-cerceve">Tüm soruları gör</Link>
          </div>
        </div>
      </section>

      {/* ---------------- CTA ---------------- */}
      <section className="bg-yesil py-16">
        <div className="kapsayici flex flex-col items-center justify-between gap-8 text-center lg:flex-row lg:text-left">
          <div>
            <h2 className="text-3xl font-bold text-white">Keşif tamamen ücretsiz.</h2>
            <p className="mt-3 max-w-xl text-green-50">
              Çatınızı ölçelim, faturanızı inceleyelim, size gerçek rakamlarla ne kazanacağınızı
              gösterelim. Karar sizin.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <a href={`tel:${ayar.telefon.replace(/\s/g, "")}`} className="btn bg-white !py-4 !px-7 text-base text-yesil-700 hover:bg-slate-100">
              <Ikon ad="telefon" className="h-5 w-5" /> {ayar.telefon}
            </a>
            <Link href="/hesaplama" className="btn !border-2 !border-white !py-4 !px-7 text-base text-white hover:bg-white hover:text-yesil-700">
              Online Hesapla
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
