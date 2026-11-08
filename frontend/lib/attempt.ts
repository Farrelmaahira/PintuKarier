import { unstable_rethrow } from "next/navigation";

export type Result<T> = { ok: true; data: T } | { ok: false; error: string };

/** Jalankan panggilan API di server action: error jadi pesan untuk UI, redirect Next tetap dilempar. */
export async function attempt<T>(fn: () => Promise<T>): Promise<Result<T>> {
  try {
    return { ok: true, data: await fn() };
  } catch (e) {
    unstable_rethrow(e);
    return { ok: false, error: e instanceof Error ? e.message : "Terjadi kesalahan, coba lagi." };
  }
}
