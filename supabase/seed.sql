-- =====================================================================
-- MAY ENERJİ — Başlangıç verileri (schema.sql'den SONRA çalıştırın)
-- Buradaki tüm sayılar yönetim panelinden değiştirilebilir.
-- Ağustos 2026 piyasa ortalamalarına göre hazırlanmıştır.
-- =====================================================================

-- ---------------------------- AYARLAR --------------------------------
insert into public.ayarlar (anahtar, deger, aciklama) values
  ('firma_adi',    'MAY Enerji ve Yazılım',                      'Ticari unvan'),
  ('slogan',       'Güneşten kazanın, geleceğe yatırım yapın',   'Ana slogan'),
  ('telefon',      '+90 000 000 00 00',                          'Ana telefon — MUTLAKA GÜNCELLEYİN'),
  ('whatsapp',     '900000000000',                               'WhatsApp numarası (ülke kodu + numara, boşluksuz)'),
  ('eposta',       'info@mayenerjiyazilim.com',                  'İletişim e-postası'),
  ('adres',        'Defne / HATAY',                              'Açık adres'),
  ('adres_detay',  'Defne, Hatay',                               'Uzun adres satırı'),
  ('calisma_saati','Pazartesi–Cumartesi 09:00–18:00',            'Çalışma saatleri'),
  ('instagram',    '',                                           'Instagram profil linki'),
  ('facebook',     '',                                           'Facebook sayfa linki'),
  ('linkedin',     '',                                           'LinkedIn sayfa linki'),
  ('harita_embed', '',                                           'Google Haritalar embed linki (iframe src)')
on conflict (anahtar) do nothing;

-- ------------------------- PARAMETRELER ------------------------------
insert into public.parametreler (anahtar, deger, birim, grup, etiket, aciklama, sira) values
  ('panel_watt',        620,  'W',    'teknik',  'Panel gücü',                'Kullandığınız standart panelin gücü', 1),
  ('sistem_kaybi',      14,   '%',    'teknik',  'Sistem kayıpları',          'Kablo, inverter, sıcaklık, kirlilik kayıpları toplamı', 2),
  ('yillik_bozunma',    0.55, '%',    'teknik',  'Yıllık panel bozunması',    'Panellerin yılda kaybettiği verim', 3),
  ('emniyet_payi',      10,   '%',    'teknik',  'Kapasite emniyet payı',     'İhtiyacın üzerine eklenen güvenlik payı', 4),
  ('fiyat_alt_sapma',   8,    '%',    'fiyat',   'Fiyat aralığı alt sapma',   'Gösterilen aralığın alt sınırı', 10),
  ('fiyat_ust_sapma',   14,   '%',    'fiyat',   'Fiyat aralığı üst sapma',   'Gösterilen aralığın üst sınırı', 11),
  ('elektrik_reel_artis', 3,  '%',    'fiyat',   'Elektriğin yıllık reel artışı', 'Enflasyon ÜSTÜ artış beklentisi. Tüm tutarlar bugünkü TL ile hesaplanır; buraya nominal zam oranı (örn. 25) yazmayın, sonuçlar anlamsız şişer.', 12),
  ('bakim_orani',       0.8,  '%',    'fiyat',   'Yıllık bakım gideri',       'Yatırım bedelinin yüzdesi olarak', 13),
  ('ozproduksiyon',     92,   '%',    'fiyat',   'Öz tüketim oranı',          'Üretimin kendi tüketiminizde kullanılan kısmı', 14),
  ('mahsuplasma',       85,   '%',    'fiyat',   'Fazla üretim mahsup oranı', 'Şebekeye verilen fazlanın karşılık oranı', 15),
  ('co2_katsayi',       0.44, 'kg',   'cevre',   'kWh başına CO₂',            'Türkiye şebeke ortalaması', 20),
  ('agac_katsayi',      21.8, 'kg',   'cevre',   'Ağaç başına yıllık CO₂',    'Bir ağacın yılda tuttuğu CO₂', 21),
  ('sistem_omru',       30,   'yıl',  'teknik',  'Sistem ömrü',               'Toplam kazanç hesabında kullanılır', 5)
on conflict (anahtar) do nothing;

-- ---------------------- MALİYET KADEMELERİ ---------------------------
-- Ölçek büyüdükçe kWp başına maliyet düşer. KDV ve montaj dahil, anahtar teslim.
insert into public.maliyet_kademeleri (min_kwp, max_kwp, tl_per_kwp, etiket, sira) values
  (0,     10,     31000, 'Konut ölçeği (0–10 kWp)',        1),
  (10,    30,     27500, 'Büyük konut / esnaf (10–30 kWp)', 2),
  (30,    100,    24500, 'Ticari (30–100 kWp)',            3),
  (100,   250,    22500, 'Sanayi (100–250 kWp)',           4),
  (250,   1000,   21000, 'Büyük sanayi (250 kWp–1 MW)',    5),
  (1000,  100000, 19500, 'Santral ölçeği (1 MW+)',         6);

-- ------------------------ ABONE GRUPLARI -----------------------------
-- elektrik_tl: EPDK tarifesi + KDV + BTV + Enerji Fonu dahil efektif TL/kWh
insert into public.abone_gruplari (kod, ad, aciklama, elektrik_tl, kdv_orani, ikon, sira) values
  ('mesken',      'Ev / Mesken',
   'Müstakil ev, villa, apartman dairesi ve site ortak alanları',
   3.85, 20, 'ev', 1),
  ('ticarethane', 'Esnaf / İş Yeri',
   'Dükkan, market, kafe, restoran, ofis, otel, oto yıkama, berber',
   5.30, 20, 'dukkan', 2),
  ('sanayi',      'Sanayi / İmalat',
   'Fabrika, imalathane, soğuk hava deposu, atölye, un-yem-tekstil tesisleri',
   4.80, 20, 'fabrika', 3),
  ('tarimsal',    'Tarımsal / Sulama',
   'Tarımsal sulama, sera, besi ve süt çiftliği, damlama sulama, arazi GES',
   3.95, 20, 'tarim', 4)
on conflict (kod) do nothing;

-- ------------------------ MONTAJ TİPLERİ -----------------------------
insert into public.montaj_tipleri (kod, ad, m2_per_kwp, carpan, aciklama, sira) values
  ('trapez',   'Sac / trapez çatı',      4.8,  1.00, 'Fabrika, depo, ahır, hangar çatıları', 1),
  ('kiremit',  'Kiremit çatı',           5.6,  1.06, 'Müstakil ev ve villa çatıları',        2),
  ('beton',    'Beton / teras çatı',     7.5,  1.08, 'Apartman ve düz betonarme çatılar',    3),
  ('arazi',    'Arazi / tarla',         12.0,  1.12, 'Boş arazi üzerine konstrüksiyonlu',    4),
  ('sundurma', 'Sundurma / otopark',     6.5,  1.22, 'Carport, sera üstü, gölgelik yapılar', 5);

-- ------------------- İLLER VE YILLIK VERİMLER ------------------------
-- kWh üretim / kWp / yıl (sistem kayıpları düşülmeden önceki brüt değer)
insert into public.iller (kod, ad, verim, sira) values
  ('hatay',      'Hatay',           1720, 1),
  ('adana',      'Adana',           1730, 2),
  ('osmaniye',   'Osmaniye',        1700, 3),
  ('mersin',     'Mersin',          1735, 4),
  ('gaziantep',  'Gaziantep',       1740, 5),
  ('kilis',      'Kilis',           1760, 6),
  ('sanliurfa',  'Şanlıurfa',       1790, 7),
  ('kahramanmaras','Kahramanmaraş', 1710, 8),
  ('antalya',    'Antalya',         1740, 9),
  ('konya',      'Konya',           1750, 10),
  ('ankara',     'Ankara',          1620, 11),
  ('izmir',      'İzmir',           1660, 12),
  ('istanbul',   'İstanbul',        1450, 13),
  ('diger',      'Diğer iller',     1600, 99)
on conflict (kod) do nothing;

-- --------------------------- CİHAZLAR --------------------------------
insert into public.cihazlar (ad, guc_w, gunluk_saat, kategori, sira) values
  -- EV
  ('Klima (12.000 BTU)',            1100,  6,   'ev', 1),
  ('Buzdolabı',                      150,  8,   'ev', 2),
  ('Derin dondurucu',                200,  8,   'ev', 3),
  ('Çamaşır makinesi',              1000,  1,   'ev', 4),
  ('Bulaşık makinesi',              1200,  1,   'ev', 5),
  ('Elektrikli fırın',              2000,  0.7, 'ev', 6),
  ('Termosifon / şofben',           2000,  1.5, 'ev', 7),
  ('Televizyon',                     120,  5,   'ev', 8),
  ('Bilgisayar',                     150,  5,   'ev', 9),
  ('LED aydınlatma (tüm ev)',        200,  6,   'ev', 10),
  ('Ütü',                           1800,  0.3, 'ev', 11),
  ('Elektrikli ısıtıcı',            2000,  4,   'ev', 12),
  ('Elektrikli araç şarjı',         3600,  3,   'ev', 13),
  ('Hidrofor / su pompası',          750,  1,   'ev', 14),
  -- İŞ YERİ / ESNAF
  ('Ticari buzdolabı / dolap',       600,  12,  'isyeri', 1),
  ('Split klima (24.000 BTU)',      2200,  8,   'isyeri', 2),
  ('Espresso makinesi',             2500,  3,   'isyeri', 3),
  ('Fırın / pizza fırını',          4000,  5,   'isyeri', 4),
  ('Vitrin dolabı',                  800,  14,  'isyeri', 5),
  ('Aydınlatma (mağaza)',            800,  10,  'isyeri', 6),
  ('Havalandırma / aspiratör',       750,  8,   'isyeri', 7),
  ('Kasa / POS / bilgisayar',        250,  10,  'isyeri', 8),
  ('Çamaşırhane makinesi',          3500,  6,   'isyeri', 9),
  ('Oto yıkama makinesi',           5500,  5,   'isyeri', 10),
  -- SANAYİ
  ('Elektrik motoru 5,5 kW',        5500,  8,   'sanayi', 1),
  ('Elektrik motoru 11 kW',        11000,  8,   'sanayi', 2),
  ('Elektrik motoru 22 kW',        22000,  8,   'sanayi', 3),
  ('Hava kompresörü 15 kW',        15000,  6,   'sanayi', 4),
  ('Soğuk hava deposu (100 m³)',    7500,  14,  'sanayi', 5),
  ('CNC / işleme merkezi',         12000,  8,   'sanayi', 6),
  ('Kaynak makinesi',               8000,  4,   'sanayi', 7),
  ('Endüstriyel fırın',            20000,  8,   'sanayi', 8),
  ('Tesis aydınlatması',            3000,  10,  'sanayi', 9),
  ('Vinç / konveyör',               7500,  5,   'sanayi', 10),
  -- TARIM
  ('Sulama pompası 7,5 kW',         7500,  8,   'tarim', 1),
  ('Sulama pompası 15 kW',         15000,  8,   'tarim', 2),
  ('Sulama pompası 30 kW',         30000,  8,   'tarim', 3),
  ('Dalgıç pompa 22 kW',           22000,  10,  'tarim', 4),
  ('Süt sağım sistemi',             5500,  4,   'tarim', 5),
  ('Süt soğutma tankı',             4000,  10,  'tarim', 6),
  ('Yem karma makinesi',           11000,  3,   'tarim', 7),
  ('Sera ısıtma / fanları',         6000,  10,  'tarim', 8),
  ('Kümes havalandırma',            4500,  16,  'tarim', 9),
  ('Soğuk oda (meyve-sebze)',       9000,  14,  'tarim', 10);

-- ------------------------- SSS ---------------------------------------
insert into public.sss (soru, cevap, sira) values
  ('Güneş enerjisi sistemi kendini kaç yılda amorti eder?',
   'Hatay ve çevresindeki güneşlenme değerleriyle, mesken kurulumlarında ortalama 4–6 yıl, ticari ve sanayi kurulumlarında 3–5 yıl, tarımsal sulama tesislerinde ise 3–4 yıl arasında amortisman süresi görüyoruz. Elektrik birim fiyatlarındaki artış bu süreyi her yıl kısaltıyor. Panellerin üretici garantisi 25–30 yıl olduğu için, amortismandan sonraki 20+ yıl net kazançtır.', 1),
  ('Elektriğim kesildiğinde sistem çalışmaya devam eder mi?',
   'Şebekeye bağlı (on-grid) sistemler, can güvenliği mevzuatı gereği elektrik kesildiğinde otomatik olarak devre dışı kalır. Kesinti sırasında da elektrik istiyorsanız akülü hibrit sistem kurmamız gerekir; hibrit çözümlerde kritik yükleriniz (buzdolabı, aydınlatma, pompa) kesintisiz çalışmaya devam eder. İhtiyacınıza göre keşifte hangisinin daha mantıklı olduğunu birlikte belirliyoruz.', 2),
  ('Ürettiğim fazla elektriği ne yapıyorum?',
   'Çift yönlü sayaç ile fazla üretiminiz şebekeye verilir ve faturanızdan mahsup edilir. Aylık üretiminiz tüketiminizi aşarsa, aradaki fark YEKDEM birim fiyatı üzerinden dağıtım şirketi tarafından hesabınıza ödenir. Tüm mahsuplaşma ve başvuru sürecini sizin adınıza biz yürütüyoruz.', 3),
  ('Kurulum için izin ve ruhsat gerekiyor mu?',
   'Çatı üstü kurulumlarda 5 MW altındaki sistemler için lisans gerekmez, ancak dağıtım şirketine (bölgemizde Toroslar EDAŞ) bağlantı başvurusu, çağrı mektubu ve proje onayı süreci işletilir. Arazi GES''lerinde ayrıca imar ve tarım dışı kullanım izinleri gündeme gelir. Tüm bu evrak sürecini anahtar teslim hizmetimizin içinde biz takip ediyoruz.', 4),
  ('Panellerin bakımı zor mu, ne kadar tutuyor?',
   'Güneş panellerinin hareketli parçası yoktur; bakım maliyeti çok düşüktür. Yılda 1–2 kez temizlik ve yıllık elektriksel kontrol yeterlidir. Yıllık bakım gideri, yatırım bedelinin yaklaşık %0,5–1''i kadardır. Kurduğumuz her sistemi uzaktan izleme paneli ile takip ediyor, verimde düşüş olduğunda sizi biz arıyoruz.', 5),
  ('Çatım güneş paneline uygun mu?',
   'Güneye, güneydoğuya veya güneybatıya bakan, gölgelenmesi az ve taşıyıcı yapısı sağlam her çatı uygundur. Kuzeye bakan çatılarda verim düşer ama düz/teras çatılarda konstrüksiyon ile açı verilerek bu sorun çözülür. Ücretsiz keşifte çatınızı ölçüyor, gölge analizini yapıyor ve size net kapasiteyi söylüyoruz.', 6),
  ('Devlet desteği veya kredi imkanı var mı?',
   'Tarımsal sulama GES''leri için Tarım ve Orman Bakanlığı hibe programları, KOBİ''ler için KOSGEB ve kalkınma ajansı destekleri, ayrıca kamu ve özel bankaların yenilenebilir enerji kredileri dönem dönem açılıyor. Yatırımınıza uygun aktif bir destek varsa başvuru dosyanızı hazırlamanıza yardımcı oluyoruz.', 7),
  ('Sistemi uzaktan takip edebiliyor muyum?',
   'Evet. Kurduğumuz her sisteme uzaktan izleme modülü ekliyoruz. Telefonunuzdan anlık üretim, günlük/aylık toplam, tasarruf tutarı ve arıza uyarılarını görebiliyorsunuz. Yazılım tarafındaki tecrübemiz sayesinde, isteyen müşterilerimize kendi tesislerine özel raporlama panelleri de geliştiriyoruz.', 8);

-- ------------------------ HİZMETLER ----------------------------------
insert into public.hizmetler (slug, baslik, ozet, icerik, ikon, sira) values
  ('konut-ges', 'Konut Çatı GES',
   'Müstakil ev, villa ve apartmanlar için anahtar teslim çatı güneş enerji sistemleri.',
   'Elektrik faturanızın büyük bölümünü sıfırlayan, çatınıza uygun ölçekte tasarlanmış sistemler kuruyoruz. Keşiften devreye almaya, dağıtım şirketi başvurusundan çift yönlü sayaç montajına kadar tüm süreci biz yönetiyoruz. Ortalama bir müstakil ev için 5–10 kWp arası sistem yeterli oluyor ve yatırım 4–6 yılda kendini karşılıyor.',
   'ev', 1),
  ('isyeri-ges', 'İş Yeri ve Esnaf GES',
   'Dükkan, market, kafe, otel ve ofisler için gündüz tüketimini karşılayan sistemler.',
   'Esnafın en büyük avantajı, elektriği tam da güneşin en çok ürettiği saatlerde tüketiyor olmasıdır. Bu da öz tüketim oranını yükseltir ve amortismanı kısaltır. Ticarethane tarifesindeki yüksek birim fiyat nedeniyle iş yeri kurulumları genellikle konuttan daha hızlı geri döner. Market soğutucuları, klima ve aydınlatma yükünüzü ölçüp doğru kapasiteyi belirliyoruz.',
   'dukkan', 2),
  ('sanayi-ges', 'Sanayi ve Fabrika GES',
   'İmalathane, fabrika ve soğuk hava depoları için yüksek kapasiteli çatı üstü çözümler.',
   'Sanayi çatıları geniş, düz ve gölgesizdir; bu da kWp başına en düşük maliyeti mümkün kılar. Trafo kapasitesi analizi, reaktif güç değerlendirmesi, yük profili çıkarma ve SCADA entegrasyonu dahil olmak üzere mühendislik tarafını uçtan uca üstleniyoruz. 100 kWp üzeri projelerde detaylı fizibilite raporu hazırlıyoruz.',
   'fabrika', 3),
  ('tarimsal-ges', 'Tarımsal Sulama ve Arazi GES',
   'Sulama tesisleri, seralar, besi ve süt çiftlikleri için tarımsal GES kurulumları.',
   'Tarımsal sulamada elektrik, işletme giderinin en büyük kalemidir. Güneş enerjisiyle bu gideri neredeyse sıfıra indiriyoruz. Sulama sezonu ile üretim sezonunun çakışması, tarımsal GES''leri en hızlı geri dönen yatırımlardan biri yapıyor. Hem şebekeye bağlı hem de pompayı doğrudan besleyen sistemler kuruyor, arazi tipi konstrüksiyonda zemin etüdüne uygun çözüm üretiyoruz.',
   'tarim', 4),
  ('hibrit-depolama', 'Hibrit Sistem ve Enerji Depolama',
   'Kesintiye dayanıklı, akülü hibrit sistemler ve batarya depolama çözümleri.',
   'Elektrik kesintilerinin kritik olduğu işletmeler — soğuk hava deposu, kümes, sağım tesisi, sunucu odası — için lityum bataryalı hibrit sistemler kuruyoruz. Gündüz üretilen fazla enerji bataryada depolanıyor, gece veya kesintide kritik yükleriniz çalışmaya devam ediyor.',
   'batarya', 5),
  ('bakim-izleme', 'Bakım, İzleme ve Yazılım',
   'Kurduğumuz ve kurmadığımız tüm sistemler için periyodik bakım ve uzaktan izleme.',
   'Panel temizliği, termal kamera ile hot-spot taraması, inverter kontrolü, string ölçümü ve yıllık verim raporu içeren bakım paketleri sunuyoruz. Yazılım tarafındaki uzmanlığımızla, çok tesisli işletmeler için tüm santralleri tek ekranda toplayan özel izleme panelleri geliştiriyoruz.',
   'izleme', 6);
