"use client";

import { useRouter } from "next/navigation";
import { Skeleton } from "../atoms/Skeleton";
import { Notice } from "../molecules/Notice";
import { Panel } from "../molecules/Panel";
import { LearningModuleForm } from "./LearningModuleForm";
import { useAdminLearningManager } from "@/lib/hooks/useAdminLearningManager";

const LIST = "/admin/learning-hub";

interface AdminLearningEditorProps {
  /** Id modul yang diubah; kosong berarti modul baru. */
  moduleId?: string;
}

/** Form modul satu halaman: tambah baru, atau ubah `moduleId`. Setelah simpan kembali ke daftar. */
export function AdminLearningEditor({ moduleId }: AdminLearningEditorProps) {
  const router = useRouter();
  const { form, loaded, editingModule, updateFormField, saveModule } = useAdminLearningManager({ editId: moduleId, onSaved: () => router.push(LIST) });

  if (moduleId && !editingModule) {
    return loaded ? <Notice tone="error">Modul tidak ditemukan.</Notice> : <Skeleton height="480px" />;
  }

  return (
    <Panel title={moduleId ? "Ubah modul" : "Modul baru"} flush>
      <LearningModuleForm form={form} onChange={updateFormField} onSubmit={saveModule} onCancel={() => router.push(LIST)} submitLabel={moduleId ? "Simpan perubahan" : "Terbitkan modul"} />
    </Panel>
  );
}
