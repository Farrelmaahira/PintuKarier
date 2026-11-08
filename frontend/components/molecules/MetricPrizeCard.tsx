import { PrizeCard } from "./PrizeCard";
import landing from "@/styles/landing.module.css";

interface MetricPrizeCardProps {
  label: string;
  highlight: string;
  img: string;
  value: number | string;
  suffix?: string;
  note: string;
}

/** Kartu prize dengan satu angka besar; angka numerik dihitung naik oleh Motion (data-count). */
export function MetricPrizeCard({
  label,
  highlight,
  img,
  value,
  suffix = "",
  note,
}: MetricPrizeCardProps) {
  const counted =
    typeof value === "number"
      ? { "data-count": value, "data-suffix": suffix }
      : {};
  return (
    <PrizeCard label={label} highlight={highlight} img={img}>
      <div className={landing.prizeBody}>
        <strong {...counted}>
          {value}
          {suffix}
        </strong>
        <span>{note}</span>
      </div>
    </PrizeCard>
  );
}
