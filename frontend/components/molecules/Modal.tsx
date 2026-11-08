"use client";

import { X } from "@phosphor-icons/react";
import { useEffect, useId, type ReactNode } from "react";
import ui from "@/styles/ui.module.css";

interface ModalProps {
  title: ReactNode;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  icon?: ReactNode;
  wide?: boolean;
  /** Kunci penutupan (Esc, klik latar, tombol X) saat proses simpan berjalan. */
  locked?: boolean;
}

/** Dialog bingkai 2px dengan header, body, dan footer aksi, setara Dialog di lulusin. */
export function Modal({ title, onClose, children, footer, icon, wide, locked }: ModalProps) {
  const titleId = useId();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && !locked && onClose();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [locked, onClose]);

  return (
    <div className={ui.modalOverlay} onMouseDown={(e) => e.target === e.currentTarget && !locked && onClose()}>
      <div className={`${ui.modal} ${wide ? ui.modalWide : ""}`} role="dialog" aria-modal="true" aria-labelledby={titleId}>
        <header className={ui.modalHead}>
          <h2 id={titleId} className={ui.modalTitle}>
            {icon}
            {title}
          </h2>
          <button type="button" className={ui.modalClose} onClick={onClose} disabled={locked} aria-label="Tutup modal">
            <X size={20} />
          </button>
        </header>
        <div className={ui.modalBody}>{children}</div>
        {footer && <footer className={ui.modalFoot}>{footer}</footer>}
      </div>
    </div>
  );
}
