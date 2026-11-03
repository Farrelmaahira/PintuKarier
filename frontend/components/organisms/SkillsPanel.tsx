import { Panel } from "../molecules/Panel";
import { SkillEditor } from "../molecules/SkillEditor";
import type { useSkillList } from "@/lib/hooks/useSkillList";
import app from "@/styles/app.module.css";

interface SkillsPanelProps {
  skillList: ReturnType<typeof useSkillList>;
}

/** Panel keahlian di profil akun; perubahan baru tersimpan setelah klik Simpan Perubahan. */
export function SkillsPanel({ skillList }: SkillsPanelProps) {
  return (
    <Panel title="Keahlian & Tag Kompetensi" tag={`${skillList.skills.length} keahlian`}>
      <div className={app.stack}>
        <p className={app.meta}>
          Keahlian ini dicocokkan dengan kriteria posisi yang kamu lamar. Klik Simpan Perubahan setelah menambah atau menghapus.
        </p>
        <SkillEditor
          skills={skillList.skills}
          draft={skillList.draft}
          placeholder="Tambah keahlian, misal: Next.js, Docker, Figma"
          addLabel="Tambah skill baru"
          onDraftChange={skillList.setDraft}
          onAdd={skillList.add}
          onRemove={skillList.remove}
        />
      </div>
    </Panel>
  );
}
