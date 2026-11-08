import { MetricPrizeCard } from "../molecules/MetricPrizeCard";
import { OutcomeRows } from "../molecules/OutcomeRows";
import { PrizeCard } from "../molecules/PrizeCard";
import { RuleHeading } from "../molecules/RuleHeading";
import { SegmentBar } from "../molecules/SegmentBar";
import { IMPACT, ROADMAP } from "@/lib/data/landing/plan";
import landing from "@/styles/landing.module.css";

const TIMELINE_BAR = [
  { key: "months-1-3", weight: 3, color: "var(--cat-lilac)" },
  { key: "months-4-6", weight: 3, color: "var(--cat-green)" },
  { key: "months-7-12", weight: 6, color: "var(--cat-orange)" },
];

/** Target dampak dan roadmap 12 bulan. */
export function ImpactSection() {
  return (
    <section className={landing.section} data-theme-section="light">
      <div className={landing.wrap}>
        <RuleHeading
          title="Target dampaknya."
          subtitle="Masih target, diukur ulang lewat uji coba bareng satu prodi dan satu mitra industri."
        />
        <div className={landing.prizes} data-reveal-row>
          {IMPACT.map((metric) => (
            <MetricPrizeCard key={metric.label} {...metric} />
          ))}
        </div>
        <SegmentBar segments={TIMELINE_BAR} />
        <RuleHeading title="12 bulan ke depan." subtitle="Mulai kecil di PNJ, terus naik ke politeknik lain." />
        <div className={landing.prizes} data-reveal-row>
          {ROADMAP.map((phase) => (
            <PrizeCard key={phase.label} label={phase.label} highlight={phase.highlight} img={phase.img}>
              <OutcomeRows rows={phase.rows} />
            </PrizeCard>
          ))}
        </div>
      </div>
    </section>
  );
}
