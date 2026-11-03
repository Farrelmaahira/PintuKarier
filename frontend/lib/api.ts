import { redirect } from "next/navigation";
import { toAppKeys, toWireKeys } from "./apiKeys";
import { getSession } from "./getSession";

type ApiInit = { method?: string; body?: unknown; auth?: boolean };

export async function api<T>(path: string, init: ApiInit = {}): Promise<T> {
  const session = init.auth === false ? null : await getSession();
  if (init.auth !== false && !session) redirect("/login");
  const res = await fetch(
    `${process.env.API_URL ?? "http://localhost:8080"}${path}`,
    {
      method: init.method ?? "GET",
      headers: {
        "Content-Type": "application/json",
        ...(session ? { Authorization: `Bearer ${session.token}` } : {}),
      },
      body:
        init.body === undefined
          ? undefined
          : JSON.stringify(toWireKeys(init.body)),
      cache: "no-store",
    },
  );
  if (res.status === 401 && session) redirect("/keluar");
  const data = res.status === 204 ? null : await res.json().catch(() => null);
  if (!res.ok)
    throw new Error(
      data?.error ?? "Server lagi bermasalah, coba lagi sebentar.",
      { cause: res.status },
    );
  return toAppKeys(data) as T;
}
