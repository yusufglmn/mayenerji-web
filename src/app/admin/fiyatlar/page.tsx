import { supabaseServer } from "@/lib/supabase/server";
import FiyatlarIstemci from "@/components/admin/FiyatlarIstemci";

export const dynamic = "force-dynamic";

export default async function FiyatlarSayfa() {
  const sb = await supabaseServer();
  const [par, kad, grp, mnt, ill] = await Promise.all([
    sb.from("parametreler").select("*").order("grup").order("sira"),
    sb.from("maliyet_kademeleri").select("*").order("sira"),
    sb.from("abone_gruplari").select("*").order("sira"),
    sb.from("montaj_tipleri").select("*").order("sira"),
    sb.from("iller").select("*").order("sira"),
  ]);

  return (
    <FiyatlarIstemci
      parametreler={par.data ?? []} kademeler={kad.data ?? []}
      gruplar={grp.data ?? []} montajlar={mnt.data ?? []} iller={ill.data ?? []}
    />
  );
}
