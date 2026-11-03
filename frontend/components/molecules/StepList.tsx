import app from "@/styles/app.module.css";

interface StepListProps {
  steps: string[];
  current: number;
}

/** Daftar langkah proses: yang sebelum `current` selesai, `current` berjalan, sisanya menunggu. */
export function StepList({ steps, current }: StepListProps) {
  return (
    <ol className={app.steps}>
      {steps.map((label, index) => (
        <li key={label} data-state={index < current ? "done" : index === current ? "now" : "todo"}>
          {label}
        </li>
      ))}
    </ol>
  );
}
