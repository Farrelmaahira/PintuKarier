import { Button } from "../atoms/Button";
import { Notice } from "./Notice";
import { Panel } from "./Panel";
import app from "@/styles/app.module.css";

interface DecisionSentPanelProps {
  firstName: string;
  decision: string;
  feedback: string;
}

/** Konfirmasi setelah keputusan dan feedback terkirim ke mahasiswa. */
export function DecisionSentPanel({ firstName, decision, feedback }: DecisionSentPanelProps) {
  return (
    <Panel title="Keputusan & feedback">
      <Notice tone="success">
        Terkirim ke {firstName}. Status lamarannya sekarang <strong>{decision}</strong>.
      </Notice>
      <blockquote className={app.quote}>{feedback}</blockquote>
      <Button variant="ghost" href="/hrd">
        Balik ke daftar kandidat
      </Button>
    </Panel>
  );
}
