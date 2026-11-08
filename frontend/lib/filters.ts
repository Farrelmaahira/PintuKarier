/** Label default untuk opsi "tanpa filter" pada FilterBar. */
export const ALL = "Semua";

/** Hitung item per kunci; entri pertama adalah total (dipakai sebagai opsi "Semua"). */
export function countBy<T>(items: T[], key: (item: T) => string, all = ALL): Record<string, number> {
  const out: Record<string, number> = { [all]: items.length };
  for (const item of items) {
    const k = key(item);
    out[k] = (out[k] ?? 0) + 1;
  }
  return out;
}
