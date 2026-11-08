import { DIMENSIONS } from "./data/scoring";

/** Skor akhir = rata-rata berbobot 5 dimensi (Tabel 1), dibulatkan. */
export function computeScore(dimensions: readonly number[]): number {
  return Math.round(dimensions.reduce((total, d, i) => total + d * DIMENSIONS[i]!.weight, 0) / 100);
}
