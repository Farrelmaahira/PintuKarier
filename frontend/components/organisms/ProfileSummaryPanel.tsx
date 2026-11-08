import { Button } from "../atoms/Button";
import { KeyValue } from "../molecules/KeyValue";
import { Panel } from "../molecules/Panel";
import type { StudentAccount } from "@/lib/data/student";

interface ProfileSummaryPanelProps {
  profile: StudentAccount;
}

/** Ringkasan profil akun mahasiswa dengan tautan untuk memperbaruinya. */
export function ProfileSummaryPanel({ profile }: ProfileSummaryPanelProps) {
  return (
    <Panel title="Profil kamu">
      <KeyValue
        items={[
          ["Nama", profile.name],
          ["NIM", <span key="studentNumber" className="num">{profile.studentNumber || "-"}</span>],
          ["Prodi", profile.studyProgram],
          ["Kampus", profile.campus || "-"],
          ["Semester", profile.semester || "-"],
          ["IPK", profile.gpa ? profile.gpa.toFixed(2) : "-"],
        ]}
      />
      <Button href="/mahasiswa/profil" variant="ghost" size="sm">
        Perbarui profil
      </Button>
    </Panel>
  );
}
