import { supabaseServer } from "@/lib/supabase/server";
import AyarlarIstemci from "@/components/admin/AyarlarIstemci";
import type { Ayar, Hizmet, Sss } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminAyarlar() {
  const sb = await supabaseServer();
  const [a, h, s] = await Promise.all([
    sb.from("ayarlar").select("*").order("anahtar"),
    sb.from("hizmetler").select("*").order("sira"),
    sb.from("sss").select("*").order("sira"),
  ]);
  return <AyarlarIstemci ayarlar={(a.data ?? []) as Ayar[]} hizmetler={(h.data ?? []) as Hizmet[]} sssler={(s.data ?? []) as Sss[]} />;
}
