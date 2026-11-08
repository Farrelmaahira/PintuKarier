import landing from "@/styles/landing.module.css";

interface SegmentBarProps {
  segments: { key: string; weight: number; color: string }[];
}

/** Bar berwarna yang tumbuh dari kiri (Motion data-grow); lebar tiap segmen sebanding dengan `weight`. */
export function SegmentBar({
  segments,
}: SegmentBarProps) {
  return (
    <div className={landing.bar} data-grow aria-hidden>
      {segments.map((segment) => (
        <span
          key={segment.key}
          style={{ flex: segment.weight, background: segment.color }}
        />
      ))}
    </div>
  );
}
