"use client";

import { Trash, Warning } from "@phosphor-icons/react";
import type { ReactNode } from "react";
import { Button } from "../atoms/Button";
import { Callout } from "./Callout";
import { Modal } from "./Modal";
import ui from "@/styles/ui.module.css";

interface ConfirmDialogProps {
  title: string;
  confirmLabel: string;
  isBusy?: boolean;
  error?: string | null;
  onConfirm: () => void;
  onClose: () => void;
  children: ReactNode;
}

/** Konfirmasi aksi merusak (hapus), pengganti window.confirm. */
export function ConfirmDialog({ title, confirmLabel, isBusy, error, onConfirm, onClose, children }: ConfirmDialogProps) {
  return (
    <Modal
      title={title}
      onClose={onClose}
      locked={isBusy}
      icon={
        <span className={ui.modalIcon}>
          <Warning size={20} weight="bold" />
        </span>
      }
      footer={
        <>
          <Button variant="plain" onClick={onClose} disabled={isBusy}>
            Batal
          </Button>
          <Button variant="danger" onClick={onConfirm} loading={isBusy} icon={<Trash size={18} />}>
            {confirmLabel}
          </Button>
        </>
      }
    >
      {children}
      {error && <Callout tone="error">{error}</Callout>}
    </Modal>
  );
}
