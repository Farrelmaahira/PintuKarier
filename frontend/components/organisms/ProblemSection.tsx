import { GuardCard } from "../molecules/GuardCard";
import { StatStep } from "../molecules/StatStep";
import { DIFFERENTIATORS } from "@/lib/data/landing/differentiators";
import { STATS } from "@/lib/data/landing/problem";
import landing from "@/styles/landing.module.css";

/** Section gelap: masalah rekrutmen, angkanya, dan pembeda Lulusin dari solusi lama. */
export function ProblemSection() {
  return (
    <section id="masalah" className={landing.ink} data-theme-section="dark">
      <div className={landing.wrap}>
        <div className={landing.manifesto}>
          <h2 className={landing.display} data-split="words">
            Ditolak tanpa penjelasan.
          </h2>
          <p data-ghost="dark">
            Perusahaan menilai kandidat dari syarat yang jelas, tapi hasilnya berhenti di meja HRD. Mahasiswa nggak tau
            kenapa ditolak, prodi nggak tau kompetensi apa yang bikin lulusannya gugur. Ujungnya, kesalahan yang sama
            diulang tiap lamaran dan tiap angkatan.
          </p>
        </div>
        <ul className={landing.steps}>
          {STATS.map((stat) => (
            <StatStep key={stat.label} {...stat} />
          ))}
        </ul>
        <p className={landing.source}>Sumber: BPS (2025), LinkedIn via Bisnis.com (2025).</p>
        <div className={landing.guards} data-reveal-row>
          {DIFFERENTIATORS.map((differentiator) => (
            <GuardCard key={differentiator.title} {...differentiator} />
          ))}
        </div>
      </div>
    </section>
  );
}
