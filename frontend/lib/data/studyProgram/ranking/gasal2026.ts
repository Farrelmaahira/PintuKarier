import type { Ranking } from "../types";

export const GASAL_2026: Ranking[string] = {
  "Semua posisi": {
    count: 214,
    items: [
      ["Testing otomatis", 64],
      ["Git dan code review", 52],
      ["SQL lanjutan", 47],
      ["TypeScript", 43],
      ["Docker dan deployment", 38],
      ["Komunikasi teknis", 29],
    ],
  },
  "Software Developer": {
    count: 118,
    items: [
      ["Testing otomatis", 71],
      ["TypeScript", 58],
      ["Git dan code review", 55],
      ["Docker dan deployment", 41],
      ["Integrasi REST API", 33],
    ],
  },
  "Data & Analitik": {
    count: 54,
    items: [
      ["SQL lanjutan", 69],
      ["Statistik inferensial", 61],
      ["Visualisasi data", 48],
      ["Python untuk data", 35],
      ["Komunikasi teknis", 30],
    ],
  },
  "Jaringan & Infrastruktur": {
    count: 34,
    items: [
      ["Linux server", 56],
      ["Keamanan jaringan", 50],
      ["Cloud dasar (AWS/GCP)", 47],
      ["Konfigurasi VLAN", 32],
    ],
  },
  "QA & Testing": { count: 8, items: [["Testing otomatis", 75]] },
};
