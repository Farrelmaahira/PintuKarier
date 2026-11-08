import { ArrowClockwise } from "@phosphor-icons/react";
import { Button } from "../atoms/Button";
import { Notice } from "../molecules/Notice";
import { Panel } from "../molecules/Panel";

interface UploadRetryPanelProps {
  error: string;
  onRetry: () => void;
}

/** Rekaman gagal terunggah: tampilkan errornya dan tombol kirim ulang. */
export function UploadRetryPanel({ error, onRetry }: UploadRetryPanelProps) {
  return (
    <Panel title="Rekaman belum terkirim">
      <Notice tone="error">{error}</Notice>
      <Button onClick={onRetry} icon={<ArrowClockwise size={20} />}>
        Kirim ulang rekaman
      </Button>
    </Panel>
  );
}
