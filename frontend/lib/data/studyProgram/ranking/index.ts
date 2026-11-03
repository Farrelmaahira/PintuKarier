import type { Ranking } from "../types";
import { GASAL_2025 } from "./gasal2025";
import { GASAL_2026 } from "./gasal2026";
import { GENAP_2025 } from "./genap2025";

export const RANKING: Ranking = {
  "Gasal 2026/2027": GASAL_2026,
  "Genap 2025/2026": GENAP_2025,
  "Gasal 2025/2026": GASAL_2025,
};

export const PERIOD_SUMMARY: Record<
  string,
  { vacancy: number; partners: number; feedback: number }
> = {
  "Gasal 2026/2027": { vacancy: 23, partners: 14, feedback: 198 },
  "Genap 2025/2026": { vacancy: 19, partners: 12, feedback: 171 },
  "Gasal 2025/2026": { vacancy: 15, partners: 9, feedback: 120 },
};
