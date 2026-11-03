import ui from "@/styles/ui.module.css";

interface StatusTrackProps {
  steps: string[];
  current: number;
  tone?: string;
  label: string;
}

/** Tahapan maju satu arah; tahap yang sudah lewat diwarnai, tahap aktif digaris bawah. */
export function StatusTrack({ steps, current, tone = "accent", label }: StatusTrackProps) {
  return (
    <ol className={ui.track} style={{ "--n": steps.length } as React.CSSProperties} aria-label={label}>
      {steps.map((step, i) => (
        <li
          key={step}
          className={`${ui.trackCell} ${i <= current ? `${ui.trackDone} ${ui[`tone-${tone}`]}` : ""} ${i === current ? ui.trackCurrent : ""}`}
          aria-current={i === current ? "step" : undefined}
        >
          <span className={ui.trackNote}>{String(i + 1).padStart(2, "0")}</span>
          <strong>{step}</strong>
        </li>
      ))}
    </ol>
  );
}
