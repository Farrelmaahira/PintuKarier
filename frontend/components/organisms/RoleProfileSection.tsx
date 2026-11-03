import { RoleProfileView } from "./RoleProfileView";
import { getRoleProfileData } from "@/lib/data/roleProfile";
import { getSession } from "@/lib/getSession";
import type { UserRole } from "@/lib/data/auth";

export interface RoleProfileSectionProps {
  role: UserRole;
}

export async function RoleProfileSection({ role }: RoleProfileSectionProps) {
  const session = await getSession();
  const data = getRoleProfileData(session, role);
  return <RoleProfileView data={data} />;
}
