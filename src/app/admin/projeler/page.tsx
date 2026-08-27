import { supabaseServer } from "@/lib/supabase/server";
import ProjelerIstemci from "@/components/admin/ProjelerIstemci";
import type { Proje } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminProjeler() {
  const sb = await supabaseServer();
  const { data } = await sb.from("projeler").select("*").order("sira").order("olusturuldu", { ascending: false });
  return <ProjelerIstemci baslangic={(data ?? []) as Proje[]} />;
}
