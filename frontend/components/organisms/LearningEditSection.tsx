import { AdminLearningEditor } from "./AdminLearningEditor";

/** Baca id modul dari params di dalam Suspense agar rute tidak memblokir prerender. */
export async function LearningEditSection({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <AdminLearningEditor moduleId={id} />;
}
