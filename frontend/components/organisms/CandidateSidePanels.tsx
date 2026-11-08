import { KeyValue } from "../molecules/KeyValue";
import { Panel } from "../molecules/Panel";
import type { Candidate } from "@/lib/data/candidate";
import app from "@/styles/app.module.css";

interface CandidateSidePanelsProps {
  candidate: Candidate;
}

/** Panel pendukung di kolom kanan: syarat yang belum terpenuhi, jawaban pre-screening, dan profil. */
export function CandidateSidePanels({ candidate }: CandidateSidePanelsProps) {
  const unmetEvidence = candidate.evidence.filter((item) => item.status !== "Terpenuhi");
  return (
    <>
      <Panel title="Belum ditemukan atau sebagian">
        {unmetEvidence.length ? (
          <ul className={app.list}>
            {unmetEvidence.map((item) => (
              <li key={item.requirement}>
                {item.requirement} {item.mustHave && <strong>(wajib)</strong>}: {item.status.toLowerCase()}
              </li>
            ))}
          </ul>
        ) : (
          <p>Semua syarat terpenuhi. Mantap.</p>
        )}
      </Panel>
      <Panel title="Pre-screening">
        {/* Tanya-jawab bertumpuk: pertanyaan panjang tidak muat di daftar dua kolom. */}
        <ol className={app.qa}>
          {(candidate.prescreenQuestions ?? []).map((question, index) => (
            <li key={`${question}-${index}`}>
              <span className={app.meta}>
                {index + 1}. {question}
              </span>
              <strong>{candidate.prescreenAnswers[index]}</strong>
            </li>
          ))}
        </ol>
      </Panel>
      <Panel title="Profil">
        <KeyValue
          items={[
            ["Prodi", candidate.studyProgram],
            ["Kampus", candidate.campus || "-"],
            ["IPK", candidate.gpa ? candidate.gpa.toFixed(2) : "-"],
            ["Angkatan", candidate.cohortYear],
          ]}
        />
      </Panel>
    </>
  );
}
