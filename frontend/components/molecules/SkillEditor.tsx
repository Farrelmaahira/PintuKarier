import { Plus, X } from "@phosphor-icons/react";
import ui from "@/styles/ui.module.css";
import app from "@/styles/app.module.css";

interface SkillEditorProps {
  skills: string[];
  draft: string;
  placeholder: string;
  addLabel: string;
  iconSize?: number;
  onDraftChange: (value: string) => void;
  onAdd: () => void;
  onRemove: (skill: string) => void;
}

/** Chip skill yang bisa dihapus plus kolom untuk menambah skill baru. */
export function SkillEditor({ skills, draft, placeholder, addLabel, iconSize = 18, onDraftChange, onAdd, onRemove }: SkillEditorProps) {
  return (
    <>
      <div className={app.chips}>
        {skills.map((skill) => (
          <span key={skill} className={app.chip}>
            {skill}
            <button type="button" aria-label={`Hapus ${skill}`} onClick={() => onRemove(skill)}>
              <X size={12} />
            </button>
          </span>
        ))}
      </div>
      <form
        className={app.inline}
        onSubmit={(event) => {
          event.preventDefault();
          onAdd();
        }}
      >
        <input className={ui.input} value={draft} onChange={(event) => onDraftChange(event.target.value)} placeholder={placeholder} aria-label={addLabel} />
        <button type="submit" className={app.squareBtn} aria-label="Tambah skill">
          <Plus size={iconSize} />
        </button>
      </form>
    </>
  );
}
