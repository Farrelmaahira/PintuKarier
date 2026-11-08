import type { ReactNode } from "react";
import ui from "@/styles/ui.module.css";

interface IconButtonProps {
  label: string;
  icon: ReactNode;
  onClick: () => void;
  danger?: boolean;
}

/** Tombol ikon persegi untuk aksi baris (edit, hapus). `label` jadi tooltip dan nama aksesibel. */
export function IconButton({ label, icon, onClick, danger }: IconButtonProps) {
  return (
    <button type="button" className={`${ui.iconBtn} ${danger ? ui.iconBtnDanger : ""}`} onClick={onClick} title={label} aria-label={label}>
      {icon}
    </button>
  );
}
