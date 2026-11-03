import type { Metadata } from "next";
import { RoleProfileSection } from "@/components/organisms/RoleProfileSection";

export const metadata: Metadata = { title: "Profil Pengelola Program Studi" };
export const instant = false;

export default function ProdiProfilePage() {
  return <RoleProfileSection role="prodi" />;
}
