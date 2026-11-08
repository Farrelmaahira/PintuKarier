import landing from "@/styles/landing.module.css";

interface OutcomeRowsProps {
  rows: readonly (readonly [string, string])[];
}

/** Baris label/nilai di bawah kartu prize. */
export function OutcomeRows({ rows }: OutcomeRowsProps) {
  return (
    <dl className={landing.outcomeRows}>
      {rows.map(([k, v]) => (
        <div key={k} style={{ display: "contents" }}>
          <dt>{k}</dt>
          <dd>{v}</dd>
        </div>
      ))}
    </dl>
  );
}
