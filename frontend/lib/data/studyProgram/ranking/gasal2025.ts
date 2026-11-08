import type { Ranking } from "../types";

export const GASAL_2025: Ranking[string] = {
  "Semua posisi": {
    count: 142,
    items: [
      ["SQL lanjutan", 58],
      ["Testing otomatis", 55],
      ["Git dan code review", 51],
      ["TypeScript", 39],
      ["Komunikasi teknis", 37],
    ],
  },
  "Software Developer": {
    count: 77,
    items: [
      ["Testing otomatis", 63],
      ["Git dan code review", 57],
      ["TypeScript", 52],
      ["Integrasi REST API", 44],
    ],
  },
  "Data & Analitik": {
    count: 36,
    items: [
      ["SQL lanjutan", 79],
      ["Visualisasi data", 55],
      ["Statistik inferensial", 54],
      ["Python untuk data", 42],
    ],
  },
  "Jaringan & Infrastruktur": {
    count: 23,
    items: [
      ["Linux server", 65],
      ["Konfigurasi VLAN", 48],
      ["Cloud dasar (AWS/GCP)", 44],
    ],
  },
  "QA & Testing": { count: 6, items: [["Testing otomatis", 67]] },
};
