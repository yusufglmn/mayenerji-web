import { supabaseServer } from "@/lib/supabase/server";
import TaleplerIstemci from "@/components/admin/TaleplerIstemci";
import type { Talep, Mesaj } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function TaleplerSayfa() {
  const sb = await supabaseServer();
  const [t, m] = await Promise.all([
    sb.from("talepler").select("*").order("olusturuldu", { ascending: false }).limit(200),
    sb.from("mesajlar").select("*").order("olusturuldu", { ascending: false }).limit(200),
  ]);
  return <TaleplerIstemci talepler={(t.data ?? []) as Talep[]} mesajlar={(m.data ?? []) as Mesaj[]} />;
}
