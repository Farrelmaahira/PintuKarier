import { Button } from "../atoms/Button";
import { Notice } from "../molecules/Notice";
import { Panel } from "../molecules/Panel";
import { ProfileCvUpload } from "./ProfileCvUpload";
import type { StudentAccount } from "@/lib/data/student";
import app from "@/styles/app.module.css";

interface ProfileSidebarProps {
  onCvParsed: (profile: StudentAccount) => string[];
}

/** Kolom kanan halaman profil: isi otomatis dari CV dan jalan pintas ke melamar. */
export function ProfileSidebar({ onCvParsed }: ProfileSidebarProps) {
  return (
    <>
      <Panel title="Isi otomatis dari CV" tag="AI">
        <div className={app.stack}>
          <p className={app.meta}>
            Unggah CV, AI ngisi field yang masih kosong: NIM, kampus, semester, IPK, ringkasan, dan skill. Isian kamu tidak ditimpa.
          </p>
          <ProfileCvUpload onDone={onCvParsed} />
        </div>
      </Panel>
      <Panel title="CV untuk melamar">
        <div className={app.stack}>
          <Notice tone="info">
            CV diunggah per lamaran, jadi kamu bisa pakai versi yang paling cocok buat tiap lowongan. AI bakal ngisi profil lamaran dari CV itu, terus kamu cek ulang sebelum lanjut.
          </Notice>
          <Button href="/mahasiswa/lamar" size="sm">
            Cari Lowongan & Lamar
          </Button>
        </div>
      </Panel>
    </>
  );
}
