import type { Ranking } from "../types";

export const GENAP_2025: Ranking[string] = {
  "Semua posisi": {
    count: 187,
    items: [
      ["Testing otomatis", 61],
      ["SQL lanjutan", 54],
      ["Git dan code review", 49],
      ["TypeScript", 45],
      ["Komunikasi teknis", 33],
      ["Docker dan deployment", 31],
    ],
  },
  "Software Developer": {
    count: 101,
    items: [
      ["Testing otomatis", 66],
      ["TypeScript", 60],
      ["Git dan code review", 51],
      ["Integrasi REST API", 39],
      ["Docker dan deployment", 35],
    ],
  },
  "Data & Analitik": {
    count: 47,
    items: [
      ["SQL lanjutan", 76],
      ["Statistik inferensial", 58],
      ["Visualisasi data", 52],
      ["Python untuk data", 40],
      ["Komunikasi teknis", 36],
    ],
  },
  "Jaringan & Infrastruktur": {
    count: 31,
    items: [
      ["Linux server", 61],
      ["Cloud dasar (AWS/GCP)", 52],
      ["Keamanan jaringan", 45],
      ["Konfigurasi VLAN", 38],
    ],
  },
  "QA & Testing": { count: 8, items: [["Testing otomatis", 70]] },
};
