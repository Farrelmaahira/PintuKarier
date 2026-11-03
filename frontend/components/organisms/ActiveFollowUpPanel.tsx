import { CheckCircle } from "@phosphor-icons/react/dist/ssr";
import { Badge } from "../atoms/Badge";
import { Panel } from "../molecules/Panel";
import { STUDY_PROGRAM } from "@/lib/data/studyProgram/info";
import app from "@/styles/app.module.css";

/** Tindak lanjut kurikulum yang sedang berjalan. */
export function ActiveFollowUpPanel() {
  return (
    <Panel title="Tindak Lanjut Kurikulum Aktif" tag={STUDY_PROGRAM.name}>
      <div className={app.stack}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: 14, background: "var(--surface-warm)", border: "var(--border)" }}>
          <CheckCircle size={24} color="var(--cat-green)" />
          <div style={{ flex: 1 }}>
            <strong style={{ fontSize: 15 }}>Workshop Testing Otomatis (Jest & Playwright)</strong>
            <div style={{ fontSize: 13, color: "var(--text-muted)" }}>
              Pengujian Perangkat Lunak · Kolaborasi Pusat Karier PNJ & Mitra Industri · Status: Berjalan
            </div>
          </div>
          <Badge tone="accent">Semester Gasal</Badge>
        </div>
      </div>
    </Panel>
  );
}
