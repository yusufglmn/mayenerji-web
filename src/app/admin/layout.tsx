import type { Metadata } from "next";
import AdminKabuk from "@/components/admin/AdminKabuk";

export const metadata: Metadata = { title: "Yönetim Paneli", robots: { index: false, follow: false } };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminKabuk>{children}</AdminKabuk>;
}
