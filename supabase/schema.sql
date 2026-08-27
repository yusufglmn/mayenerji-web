-- =====================================================================
-- MAY ENERJİ VE YAZILIM — Supabase veritabanı şeması
-- Supabase > SQL Editor'e yapıştırıp "Run" deyin. Tek seferde çalışır.
-- =====================================================================

-- ---------- 1. AYARLAR (site geneli: telefon, adres, sosyal medya) ----
create table if not exists public.ayarlar (
  anahtar     text primary key,
  deger       text not null default '',
  aciklama    text default '',
  guncellendi timestamptz not null default now()
);

-- ---------- 2. FİYAT PARAMETRELERİ (hesaplayıcının beyni) -------------
-- Tüm sayısal katsayılar burada. Panelden değiştirince site anında güncellenir.
create table if not exists public.parametreler (
  anahtar     text primary key,
  deger       numeric not null,
  birim       text default '',
  grup        text default 'genel',
  etiket      text not null,
  aciklama    text default '',
  sira        int default 0,
  guncellendi timestamptz not null default now()
);

-- ---------- 3. MALİYET KADEMELERİ (kWp başına TL, ölçek indirimli) ----
create table if not exists public.maliyet_kademeleri (
  id           bigint generated always as identity primary key,
  min_kwp      numeric not null,
  max_kwp      numeric not null,
  tl_per_kwp   numeric not null,
  etiket       text not null,
  sira         int default 0
);

-- ---------- 4. ABONE GRUPLARI (mesken / esnaf / sanayi / tarımsal) ----
create table if not exists public.abone_gruplari (
  kod            text primary key,        -- mesken | ticarethane | sanayi | tarimsal
  ad             text not null,
  aciklama       text default '',
  elektrik_tl    numeric not null,        -- vergiler dahil efektif TL/kWh
  kdv_orani      numeric not null default 20,  -- sistem yatırımı KDV'si (%)
  ikon           text default 'ev',
  sira           int default 0,
  aktif          boolean default true
);

-- ---------- 5. CİHAZ KATALOĞU (cihaz seçerek hesaplama) --------------
create table if not exists public.cihazlar (
  id             bigint generated always as identity primary key,
  ad             text not null,
  guc_w          numeric not null,        -- ortalama çekilen güç (W)
  gunluk_saat    numeric not null,        -- günlük ortalama çalışma (saat)
  kategori       text not null default 'ev',  -- ev | isyeri | sanayi | tarim
  ikon           text default '',
  sira           int default 0,
  aktif          boolean default true
);

-- ---------- 6. MONTAJ TİPLERİ (m² başına kapasite) -------------------
create table if not exists public.montaj_tipleri (
  kod          text primary key,
  ad           text not null,
  m2_per_kwp   numeric not null,
  carpan       numeric not null default 1.0,  -- maliyet çarpanı
  aciklama     text default '',
  sira         int default 0
);

-- ---------- 7. İLLER / VERİM (kWh üretim per kWp per yıl) ------------
create table if not exists public.iller (
  kod        text primary key,
  ad         text not null,
  verim      numeric not null,   -- kWh/kWp/yıl
  sira       int default 0
);

-- ---------- 8. HİZMETLER (Hizmetler sayfası kartları) ----------------
create table if not exists public.hizmetler (
  id          bigint generated always as identity primary key,
  slug        text unique not null,
  baslik      text not null,
  ozet        text not null,
  icerik      text default '',
  ikon        text default 'gunes',
  gorsel_url  text default '',
  sira        int default 0,
  yayinda     boolean default true,
  olusturuldu timestamptz not null default now()
);

-- ---------- 9. PROJELER / REFERANSLAR --------------------------------
create table if not exists public.projeler (
  id           bigint generated always as identity primary key,
  slug         text unique not null,
  baslik       text not null,
  ozet         text default '',
  icerik       text default '',
  konum        text default '',
  segment      text default 'mesken',
  guc_kwp      numeric,
  panel_sayisi int,
  tamamlanma   date,
  kapak_url    text default '',
  galeri       jsonb not null default '[]'::jsonb,   -- ["https://...","..."]
  one_cikan    boolean default false,
  yayinda      boolean default true,
  sira         int default 0,
  olusturuldu  timestamptz not null default now()
);

-- ---------- 10. SSS ---------------------------------------------------
create table if not exists public.sss (
  id      bigint generated always as identity primary key,
  soru    text not null,
  cevap   text not null,
  sira    int default 0,
  yayinda boolean default true
);

-- ---------- 11. TEKLİF TALEPLERİ (hesaplayıcıdan gelenler) -----------
create table if not exists public.talepler (
  id           bigint generated always as identity primary key,
  ad_soyad     text not null,
  telefon      text not null,
  eposta       text default '',
  il           text default '',
  segment      text default '',
  girdi        jsonb not null default '{}'::jsonb,   -- kullanıcının girdikleri
  sonuc        jsonb not null default '{}'::jsonb,   -- hesaplanan çıktı
  not_metni    text default '',
  durum        text not null default 'yeni',         -- yeni | arandi | teklif | kazanildi | kaybedildi
  olusturuldu  timestamptz not null default now()
);

-- ---------- 12. İLETİŞİM MESAJLARI -----------------------------------
create table if not exists public.mesajlar (
  id          bigint generated always as identity primary key,
  ad_soyad    text not null,
  telefon     text default '',
  eposta      text default '',
  konu        text default '',
  mesaj       text not null,
  okundu      boolean default false,
  olusturuldu timestamptz not null default now()
);

-- =====================================================================
-- RLS: herkes yayındaki içeriği OKUR, sadece giriş yapmış admin YAZAR
-- =====================================================================
alter table public.ayarlar             enable row level security;
alter table public.parametreler        enable row level security;
alter table public.maliyet_kademeleri  enable row level security;
alter table public.abone_gruplari      enable row level security;
alter table public.cihazlar            enable row level security;
alter table public.montaj_tipleri      enable row level security;
alter table public.iller               enable row level security;
alter table public.hizmetler           enable row level security;
alter table public.projeler            enable row level security;
alter table public.sss                 enable row level security;
alter table public.talepler            enable row level security;
alter table public.mesajlar            enable row level security;

do $$
declare t text;
begin
  foreach t in array array['ayarlar','parametreler','maliyet_kademeleri','abone_gruplari',
                           'cihazlar','montaj_tipleri','iller','hizmetler','projeler','sss']
  loop
    execute format('drop policy if exists "public_read" on public.%I', t);
    execute format('create policy "public_read" on public.%I for select using (true)', t);
    execute format('drop policy if exists "admin_write" on public.%I', t);
    execute format('create policy "admin_write" on public.%I for all to authenticated using (true) with check (true)', t);
  end loop;
end $$;

-- Talepler ve mesajlar: herkes YAZABİLİR (form gönderimi), sadece admin OKUR
drop policy if exists "anyone_insert" on public.talepler;
create policy "anyone_insert" on public.talepler for insert with check (true);
drop policy if exists "admin_all" on public.talepler;
create policy "admin_all" on public.talepler for all to authenticated using (true) with check (true);

drop policy if exists "anyone_insert" on public.mesajlar;
create policy "anyone_insert" on public.mesajlar for insert with check (true);
drop policy if exists "admin_all" on public.mesajlar;
create policy "admin_all" on public.mesajlar for all to authenticated using (true) with check (true);

-- =====================================================================
-- STORAGE: proje fotoğrafları için herkese açık bucket
-- =====================================================================
insert into storage.buckets (id, name, public)
values ('gorseller', 'gorseller', true)
on conflict (id) do nothing;

drop policy if exists "gorsel_public_read" on storage.objects;
create policy "gorsel_public_read" on storage.objects
  for select using (bucket_id = 'gorseller');

drop policy if exists "gorsel_admin_write" on storage.objects;
create policy "gorsel_admin_write" on storage.objects
  for all to authenticated using (bucket_id = 'gorseller') with check (bucket_id = 'gorseller');
