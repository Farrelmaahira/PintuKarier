import { CheckCircle } from "@phosphor-icons/react/dist/ssr";
import { Badge } from "../atoms/Badge";
import { Panel } from "../molecules/Panel";
import { STUDY_PROGRAM } from "@/lib/data/studyProgram/info";
import app from "@/styles/app.module.css";
import rows from "@/styles/rows.module.css";

/** Tindak lanjut kurikulum yang sedang berjalan. */
export function ActiveFollowUpPanel() {
  return (
    <Panel title="Tindak Lanjut Kurikulum Aktif" tag={STUDY_PROGRAM.name} flush>
      <ul className={rows.list}>
        <li className={rows.row}>
          <div className={rows.main}>
            <div className={rows.top}>
              <CheckCircle size={20} aria-hidden />
              <strong>Workshop Testing Otomatis (Jest & Playwright)</strong>
            </div>
            <span className={app.meta}>Pengujian Perangkat Lunak · Kolaborasi Pusat Karier PNJ & Mitra Industri · Status: Berjalan</span>
          </div>
          <Badge tone="accent">Semester Gasal</Badge>
        </li>
      </ul>
    </Panel>
  );
}
