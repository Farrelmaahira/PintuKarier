import { BarChart } from "../molecules/BarChart";
import { api } from "@/lib/api";

interface BenchmarkRow {
  feature: string;
  name: string;
  seconds: number | null;
}

const SERIES_TONE: Record<string, string> = {
  Groq: "var(--accent)",
  Gemini: "var(--cat-yellow)",
  Manual: "var(--text-subtle)",
};

/** Benchmark per fitur: waktu Groq vs Gemini vs manual, diukur AI Engine dengan fitur asli. */
export async function ModelBenchmark() {
  const rows = await api<BenchmarkRow[]>("/benchmark", { auth: false }).catch(() => null);
  if (!rows?.length) return <p>Benchmark model belum tersedia, mungkin masih diukur. Coba muat ulang sebentar lagi.</p>;

  const seriesNames = [...new Set(rows.map((row) => row.name))];
  const features = [...new Set(rows.map((row) => row.feature))];
  return (
    <BarChart
      title="Waktu per fitur dalam detik (skala log), makin pendek makin cepat"
      unit=" dtk"
      log
      series={seriesNames.map((name) => ({ name, tone: SERIES_TONE[name.split(" ")[0]!] ?? "currentColor" }))}
      groups={features.map((feature) => ({
        label: feature,
        values: seriesNames.map((name) => rows.find((row) => row.feature === feature && row.name === name)?.seconds ?? null),
      }))}
    />
  );
}
