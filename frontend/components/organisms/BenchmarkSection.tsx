import { Suspense } from "react";
import { ModelBenchmark } from "./ModelBenchmark";
import landing from "@/styles/landing.module.css";

/** Benchmark langsung ke model AI lewat backend. */
export function BenchmarkSection() {
  return (
    <section className={landing.inkSection} data-theme-section="dark">
      <div className={landing.wrapWide}>
        <h2 className={landing.h2Display} data-split="words">
          Benchmark model AI.
        </h2>
        <p className={landing.subInk}>
          Fitur yang sama dijalankan di Groq dan Gemini, lalu waktunya dibandingkan dengan kerja manual HRD. Diuji ulang tiap 6 jam.
        </p>
        <Suspense fallback={<p>Memuat benchmark...</p>}>
          <ModelBenchmark />
        </Suspense>
      </div>
    </section>
  );
}
