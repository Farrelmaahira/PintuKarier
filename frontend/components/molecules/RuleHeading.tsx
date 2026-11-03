import landing from "@/styles/landing.module.css";

interface RuleHeadingProps {
  title: string;
  subtitle: string;
}

/** Judul subseksi landing dengan garis di bawahnya dan satu kalimat penjelas. */
export function RuleHeading({ title, subtitle }: RuleHeadingProps) {
  return (
    <div className={landing.ruleHead}>
      <h2 className={landing.title}>{title}</h2>
      <p className={landing.subGrey}>{subtitle}</p>
    </div>
  );
}
