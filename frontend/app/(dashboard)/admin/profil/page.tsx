import type { Metadata } from "next";
import { RoleProfileSection } from "@/components/organisms/RoleProfileSection";

export const metadata: Metadata = { title: "Profil Pengelola Pusat Karier" };
export const instant = false;

export function AdminProfilePage() {
  return <RoleProfileSection role="admin" />;
}

export default AdminProfilePage;
