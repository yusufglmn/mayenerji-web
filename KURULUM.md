# MAY Enerji ve Yazılım — Web Sitesi Kurulum Rehberi

Bu rehber, sıfır teknik bilgiyle siteyi yayına almanız için yazıldı. Sırayla takip edin.
**Toplam süre: yaklaşık 1–2 saat. Aylık maliyet: 0 ₺ (domain hariç).**

---

## Özet: Ne kuruyoruz?

| Parça | Ne işe yarıyor | Nerede barınıyor | Ücret |
|---|---|---|---|
| Web sitesi | Ziyaretçilerin gördüğü sayfalar | **Vercel** | Ücretsiz |
| Veritabanı | Fiyatlar, projeler, talepler | **Supabase** | Ücretsiz |
| Fotoğraflar | Proje görselleri | Supabase Storage | Ücretsiz (1 GB) |
| Alan adı | mayenerjiyazilim.com | Aldığınız firma | Yıllık ~500 ₺ |
| E-posta | info@mayenerjiyazilim.com | Mevcut sağlayıcınız | Mevcut |

> **Ayrı hosting almanıza gerek yok.** Vercel hem sunucu hem CDN görevi görüyor ve bu
> ölçekteki bir site için ücretsiz planı fazlasıyla yeterli. Sunucu bakımı, güvenlik
> güncellemesi, SSL sertifikası — hepsi otomatik.

---

## ADIM 1 — Supabase hesabı ve veritabanı (20 dk)

1. https://supabase.com adresine gidin → **Start your project** → GitHub veya e-posta ile kaydolun.
2. **New project** deyin:
   - **Name:** `mayenerji`
   - **Database Password:** güçlü bir şifre oluşturun ve **bir yere kaydedin**
   - **Region:** `Central EU (Frankfurt)` — Türkiye'ye en yakın olanı
3. Proje hazırlanana kadar ~2 dakika bekleyin.
4. Sol menüden **SQL Editor** → **New query** deyin.
5. Bu paketteki `supabase/schema.sql` dosyasını açın, **tüm içeriğini** kopyalayıp editöre
   yapıştırın → **Run** butonuna basın. "Success" yazmalı.
6. Tekrar **New query** deyin. Bu sefer `supabase/seed.sql` dosyasının içeriğini yapıştırıp
   **Run** deyin. Bu, başlangıç fiyatlarını ve içerikleri yükler.

### Yönetici hesabınızı oluşturun
7. Sol menüden **Authentication** → **Users** → **Add user** → **Create new user**:
   - **Email:** `info@mayenerjiyazilim.com`
   - **Password:** panele gireceğiniz şifre
   - **Auto Confirm User** kutucuğunu **işaretleyin** (önemli!)
8. **Create user** deyin.

### Anahtarlarınızı not alın
9. Sol menüden **Project Settings** (dişli) → **API**. Şu üç değeri kopyalayıp bir yere yazın:
   - **Project URL** → `https://xxxxx.supabase.co`
   - **anon / public** anahtarı → `eyJhbGci...`
   - **service_role** anahtarı → `eyJhbGci...` (**bunu kimseyle paylaşmayın**)

---

## ADIM 2 — Kodu GitHub'a yükleyin (15 dk)

1. https://github.com adresinde hesap açın (yoksa).
2. Sağ üstteki **+** → **New repository**:
   - **Repository name:** `mayenerji-web`
   - **Private** seçin
   - **Create repository** deyin
3. Açılan sayfada **uploading an existing file** bağlantısına tıklayın.
4. Bu paketteki `mayenerji-web` klasörünün **içindeki her şeyi** sürükleyip bırakın.
   > `node_modules` ve `.next` klasörleri varsa **yüklemeyin** — gereksizler.
5. **Commit changes** deyin.

---

## ADIM 3 — Vercel'e yayınlayın (15 dk)

1. https://vercel.com → **Sign up** → **Continue with GitHub**.
2. **Add New… → Project** → `mayenerji-web` deponuzu **Import** edin.
3. **Environment Variables** bölümünü açın ve şu satırları tek tek ekleyin:

   | Name | Value |
   |---|---|
   | `NEXT_PUBLIC_SUPABASE_URL` | Supabase Project URL |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon / public anahtarı |
   | `SUPABASE_SERVICE_ROLE_KEY` | service_role anahtarı |
   | `NEXT_PUBLIC_SITE_URL` | `https://mayenerjiyazilim.com` |

4. **Deploy** deyin. 2–3 dakika sürer.
5. Biten yapı size `mayenerji-web-xxxx.vercel.app` gibi geçici bir adres verir. Açıp kontrol edin.

---

## ADIM 4 — Alan adınızı bağlayın (20 dk + bekleme)

1. Vercel'de projeniz → **Settings** → **Domains** → `mayenerjiyazilim.com` yazıp **Add**.
2. Vercel size iki kayıt gösterecek. Alan adını aldığınız firmanın (Natro, İsimtescil,
   GoDaddy vb.) **DNS yönetimi** paneline girip şunları ekleyin:

   | Tip | Ad | Değer |
   |---|---|---|
   | `A` | `@` | `76.76.21.21` |
   | `CNAME` | `www` | `cname.vercel-dns.com` |

   > Vercel ekranındaki değerler farklıysa **Vercel'in gösterdiğini** kullanın, bu tablo örnektir.

3. **E-posta kayıtlarınıza dokunmayın!** `MX` ve mail ile ilgili `TXT` kayıtları aynen kalsın,
   yoksa `info@mayenerjiyazilim.com` adresiniz çalışmaz.
4. DNS yayılması 15 dakika ile 24 saat sürebilir. Vercel yeşil tik gösterince tamamdır.
   SSL sertifikası (https) otomatik kurulur.

---

## ADIM 5 — Form bildirimlerini e-postanıza yönlendirin (10 dk, isteğe bağlı)

Formlar Supabase'e her koşulda kaydedilir ve panelde görünür. Ek olarak size **anlık e-posta**
gelmesini istiyorsanız, e-posta sağlayıcınızın SMTP bilgilerini Vercel'e ekleyin:

| Name | Value (örnek) |
|---|---|
| `SMTP_HOST` | `mail.mayenerjiyazilim.com` |
| `SMTP_PORT` | `465` |
| `SMTP_SECURE` | `true` |
| `SMTP_USER` | `info@mayenerjiyazilim.com` |
| `SMTP_PASS` | e-posta şifreniz |
| `MAIL_TO` | `info@mayenerjiyazilim.com` |

> Doğru sunucu adı ve portu e-posta hizmetinizi aldığınız firmadan öğrenebilirsiniz.
> Ekledikten sonra Vercel'de **Deployments → ⋯ → Redeploy** deyin.

---

## ADIM 6 — İlk ayarlarınızı yapın (15 dk) ⚠️ ATLAMAYIN

`https://mayenerjiyazilim.com/admin` adresine gidin, Adım 1'de oluşturduğunuz e-posta ve
şifre ile girin. Sonra sırayla:

### a) Site Ayarları → İletişim & Firma
**Telefon ve WhatsApp numarasını mutlaka değiştirin** — şu an yer tutucu (`+90 000 000 00 00`)
görünüyor. WhatsApp numarasını ülke kodlu ve boşluksuz yazın: `905321234567`

Google Haritalar konumunuzu eklemek isterseniz: Google Maps'te işletmenizi bulun →
**Paylaş** → **Harita yerleştir** → `iframe` kodundaki `src="..."` içindeki adresi kopyalayıp
`harita_embed` alanına yapıştırın.

### b) Fiyat & Hesaplama → kWp Birim Fiyatları
Kendi maliyet yapınıza göre güncelleyin. **Bu, en sık dokunacağınız ekrandır.**
Şu anki değerler Ağustos 2026 piyasa ortalamalarıdır; sizin gerçek maliyetiniz farklı olacaktır.

### c) Fiyat & Hesaplama → Elektrik Tarifeleri
EPDK tarifesi her çeyrek değişiyor. Değiştiğinde buradaki TL/kWh değerlerini güncelleyin.

### d) Projeler & Fotoğraflar
İlk kurulumunuzun fotoğraflarını ekleyin. Fotoğraflı referans, sitedeki en ikna edici unsurdur.

---

## Günlük kullanım

| Ne yapmak istiyorsunuz | Nereye gideceksiniz |
|---|---|
| Gelen teklif taleplerini görmek | `/admin/talepler` |
| Yeni proje + fotoğraf eklemek | `/admin/projeler` → Yeni proje ekle |
| Fiyatları güncellemek | `/admin/fiyatlar` |
| Telefon / adres değiştirmek | `/admin/ayarlar` |
| Hizmet metinlerini düzenlemek | `/admin/ayarlar` → Hizmet Metinleri |
| Yeni SSS eklemek | `/admin/ayarlar` → Sıkça Sorulan Sorular |

Yaptığınız her değişiklik **anında** sitede görünür. Kod değişikliği veya yeniden yayınlama gerekmez.

---

## Bilgisayarınızda test etmek isterseniz

```bash
cd mayenerji-web
npm install
cp .env.example .env.local     # içini Supabase bilgilerinizle doldurun
npm run dev
# tarayıcıda http://localhost:3000
```

---

## Sık karşılaşılan sorunlar

**Panele giremiyorum**
Supabase → Authentication → Users bölümünde kullanıcının `Confirmed` olduğundan emin olun.

**Fotoğraf yüklenmiyor**
`schema.sql` dosyasını eksiksiz çalıştırdığınızdan emin olun — `gorseller` adlı depolama alanını
o dosya oluşturuyor. Supabase → Storage bölümünde `gorseller` görünmeli.

**Fiyatları değiştirdim ama sitede eskisi görünüyor**
Tarayıcı önbelleğidir. `Ctrl + F5` ile sayfayı yenileyin.

**Formdan mesaj geliyor ama e-posta gelmiyor**
SMTP ayarları eksik veya hatalıdır. Mesajlar yine de `/admin/talepler` altında birikir —
veri kaybı olmaz.

**Site açılmıyor / "DNS_PROBE" hatası**
DNS kayıtları henüz yayılmamıştır. 24 saat bekleyin. Vercel → Settings → Domains'de
yeşil tik çıktıysa sorun sizin tarafınızdaki DNS önbelleğidir.

---

## Önemli uyarı: hesaplayıcı bir tekliftir, taahhüt değildir

Sitedeki hesaplayıcı **ön fizibilite** aracıdır. Her sonuç ekranında ve sayfa altında bunu
belirten uyarı vardır. Yine de:

- Fiyat aralığını gerçek maliyetinize göre ayarlayın (çok düşük göstermek sahada sorun yaratır)
- Panelden fiyatları düzenli güncelleyin — eskiyen fiyat, gelen müşteriyle pazarlık sorununa döner
- Amortisman rakamları enflasyondan arındırılmış (reel) hesaplanır; bu bilinçli bir tercihtir.
  Nominal enflasyonla hesaplasaydık rakamlar gerçekçi olmayacak kadar iyi görünürdü.
