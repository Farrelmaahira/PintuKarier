import { redirect } from "next/navigation";
import { Sidebar } from "./Sidebar";
import { getSession } from "@/lib/getSession";

/** Membaca sesi saat request lalu merender sidebar; proxy sudah menjaga, ini lapis kedua. */
export async function SessionSidebar() {
  const session = await getSession();
  if (!session) redirect("/login");
  return <Sidebar session={session} />;
}
