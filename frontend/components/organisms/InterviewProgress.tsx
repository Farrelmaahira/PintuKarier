import { Panel } from "../molecules/Panel";
import type { InterviewPhase } from "@/lib/data/interview";
import app from "@/styles/app.module.css";

interface InterviewProgressProps {
  title: string;
  tag: string;
  phase: InterviewPhase;
  questionCount: number;
  questionIndex: number;
  steps: string[];
  completedSteps: number;
}

const stateOf = (isDone: boolean, isNow: boolean) => (isDone ? "done" : isNow ? "now" : "todo");

/** Daftar langkah interview (pertanyaan lalu proses) beserta tips. */
export function InterviewProgress({ title, tag, phase, questionCount, questionIndex, steps, completedSteps }: InterviewProgressProps) {
  const finished = phase === "processing" || phase === "done";
  return (
    <div className={app.stack}>
      <Panel title={title} tag={tag}>
        <ol className={app.steps}>
          {Array.from({ length: questionCount }, (_, i) => (
            <li key={i} data-state={stateOf(finished || i < questionIndex, phase === "answer" && i === questionIndex)}>
              Pertanyaan {i + 1}
            </li>
          ))}
          {steps.map((step, i) => (
            <li key={step} data-state={stateOf(phase === "done" || (phase === "processing" && i < completedSteps), phase === "processing" && i === completedSteps)}>
              {step}
            </li>
          ))}
        </ol>
      </Panel>
      <Panel title="Tips biar lancar">
        <ul className={app.list}>
          <li>Pakai pola situasi, aksi, hasil. Sebut angka kalau ada.</li>
          <li>Ceritain peran kamu sendiri, bukan cuma kerjaan tim.</li>
          <li>Nggak tau? Bilang jujur, terus jelasin cara kamu bakal nyari tahu.</li>
        </ul>
      </Panel>
    </div>
  );
}
