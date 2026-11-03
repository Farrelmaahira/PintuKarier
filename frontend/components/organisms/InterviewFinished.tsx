import { Button } from "../atoms/Button";
import { Notice } from "../molecules/Notice";
import { Panel } from "../molecules/Panel";
import app from "@/styles/app.module.css";

interface InterviewFinishedProps {
  company: string;
  onFinish?: () => void;
}

/** Interview sungguhan selesai: jawaban sudah masuk antrean HRD. */
export function InterviewFinished({ company, onFinish }: InterviewFinishedProps) {
  return (
    <Panel title="Interview selesai">
      <Notice tone="success">Jawaban kamu udah masuk dan lagi di antrean HRD {company}.</Notice>
      <p className={app.note}>Kamu bakal dapet kabar di halaman lamaran. Lolos atau belum, feedback tertulisnya tetap dikirim.</p>
      {onFinish ? <Button onClick={onFinish}>Selesai & Balik ke Beranda</Button> : <Button href="/mahasiswa">Balik ke lamaran saya</Button>}
    </Panel>
  );
}
