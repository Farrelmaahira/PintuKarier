import { MetricPrizeCard } from "../molecules/MetricPrizeCard";
import { OutcomeRows } from "../molecules/OutcomeRows";
import { PrizeCard } from "../molecules/PrizeCard";
import { RuleHeading } from "../molecules/RuleHeading";
import { SegmentBar } from "../molecules/SegmentBar";
import { CATEGORIES, DIMENSIONS } from "@/lib/data/scoring";
import landing from "@/styles/landing.module.css";

/** Evidence-Based Scoring: 5 dimensi berbobot, lalu 4 kategori hasil. */
export function ScoringSection() {
  return (
    <section id="skor" className={landing.section} data-theme-section="light">
      <div className={landing.wrap}>
        <RuleHeading
          title="Evidence-Based Scoring, 5 dimensi."
          subtitle="Skill yang cuma disebut beda sama skill yang beneran dipakai. Yang dihitung yang kedua."
        />
        <div className={landing.prizes} data-reveal-row>
          {DIMENSIONS.map((dimension) => (
            <MetricPrizeCard
              key={dimension.name}
              label={dimension.name}
              highlight={dimension.highlight}
              img={dimension.img}
              value={dimension.weight}
              suffix="%"
              note={dimension.example}
            />
          ))}
          <MetricPrizeCard
            label="Fresh graduate"
            highlight="var(--cat-green)"
            img="doodles/dim-fresh-graduate"
            value="Tetap fair"
            note="Proyek, organisasi, magang, dan portofolio dihitung. Belum pernah kerja full-time bukan alasan kalah."
          />
        </div>
        <SegmentBar segments={DIMENSIONS.map((d) => ({ key: d.name, weight: d.weight, color: d.highlight }))} />
        <RuleHeading
          title="Skor bukan vonis."
          subtitle="Sistem cek syarat wajib dulu, baru taruh kandidat di salah satu dari 4 kategori. HRD yang mutusin."
        />
        <div className={landing.outcomes} data-reveal-row>
          {CATEGORIES.map((category) => (
            <PrizeCard key={category.name} label={category.name} highlight={category.highlight} img={category.img}>
              <OutcomeRows
                rows={[
                  ["Kapan", category.range],
                  ["Artinya", category.meaning],
                ]}
              />
            </PrizeCard>
          ))}
        </div>
      </div>
    </section>
  );
}
