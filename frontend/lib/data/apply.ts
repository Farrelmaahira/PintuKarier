export const APPLY_STEPS = ["Unggah CV", "Cek profil", "Pre-screening", "AI Interview"];

/** Langkah awal alur lamaran untuk tiap kode tahap dari backend; selain itu berarti lamaran sudah masuk. */
export const STEP_BY_STAGE_CODE: Record<string, number> = {
  applied: 0,
  cv_uploaded: 1,
  profile_checked: 2,
  prescreening_done: 3,
};
