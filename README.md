# MAY Enerji ve Yazılım — Kurumsal Web Sitesi

Hatay Defne merkezli güneş enerji sistemleri (GES) firması için tanıtım sitesi,
online fiyat/fizibilite hesaplayıcısı ve yönetim paneli.

**Kuruluma başlamak için → [`KURULUM.md`](./KURULUM.md)**

## Teknoloji

- **Next.js 15** (App Router) + TypeScript
- **Tailwind CSS 3**
- **Supabase** — PostgreSQL, Auth, Storage
- **Nodemailer** — form bildirimleri (isteğe bağlı)

## Yapı

```
src/
├─ app/
│  ├─ page.tsx              Ana sayfa
│  ├─ hizmetler/            Hizmet detayları
│  ├─ hesaplama/            Fiyat hesaplayıcı
│  ├─ projeler/             Referans galerisi
│  ├─ hakkimizda/  sss/  iletisim/
│  ├─ api/teklif/           Teklif talebi ucu
│  ├─ api/iletisim/         İletişim formu ucu
│  └─ admin/                Yönetim paneli (Auth korumalı)
├─ components/              Arayüz bileşenleri
├─ lib/
│  ├─ calc.ts               ★ Hesaplama motoru
│  ├─ data.ts               Sunucu tarafı veri çekme
│  ├─ types.ts  format.ts  mail.ts
│  └─ supabase/             İstemci ve sunucu bağlantıları
└─ middleware.ts            /admin koruması

supabase/
├─ schema.sql               Tablolar, RLS politikaları, storage
└─ seed.sql                 Başlangıç verileri (fiyatlar, içerik)
```

## Hesaplama motoru

`src/lib/calc.ts` — sabit kodlanmış sayı yoktur; tüm katsayılar veritabanından gelir ve
yönetim panelinden düzenlenebilir.

**Akış:** tüketim tespiti (fatura / kWh / cihaz listesi) → bölge verimi ve sistem kayıplarıyla
gerekli kWp → çatı/arazi alanı kısıtı → panel adedine yuvarlama → kademeli birim fiyatla
maliyet aralığı → reel bazlı tasarruf, amortisman ve 25 yıllık kazanç.

Tüm parasal sonuçlar **bugünkü TL** ile ifade edilir; nominal enflasyon uygulanmaz.

## Yerel geliştirme

```bash
npm install
cp .env.example .env.local   # Supabase bilgilerinizi girin
npm run dev
```

Supabase yapılandırılmamışsa site, `calc.ts` ve `data.ts` içindeki varsayılan değerlerle
çalışmaya devam eder — boş sayfa göstermez.
