import type { Metadata } from "next";
import { RoleProfileSection } from "@/components/organisms/RoleProfileSection";

export const metadata: Metadata = { title: "Profil HRD & Perusahaan" };
export const instant = false;

export default function HrdProfilePage() {
  return <RoleProfileSection role="hrd" />;
}
