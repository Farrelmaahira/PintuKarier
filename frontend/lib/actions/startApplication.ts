"use server";

import { api } from "../api";
import { attempt } from "../attempt";
import type { Application } from "../data/student";

export async function startApplication(vacancyId: string) {
  return attempt(() =>
    api<Application>("/lamaran", { method: "POST", body: { vacancyId } }),
  );
}
