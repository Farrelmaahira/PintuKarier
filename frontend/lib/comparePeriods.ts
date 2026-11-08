/** Urutan periode terbaru dulu: "Gasal 2026/2027" di atas "Genap 2025/2026". */
export const comparePeriods = (a: string, b: string) => {
  const key = (period: string) => Number(period.split("/")[1] ?? 0) * 2 + (period.startsWith("Gasal") ? 0 : 1);
  return key(b) - key(a);
};
