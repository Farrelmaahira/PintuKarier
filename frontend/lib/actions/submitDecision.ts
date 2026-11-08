"use server";

import { refresh } from "next/cache";
import { api } from "../api";
import { attempt } from "../attempt";
import type { Candidate } from "../data/candidate";

export type DecisionInput = {
  category: string;
  reason: string;
  decision: string;
  feedback: string;
};

export async function submitDecision(
  candidateId: string,
  input: DecisionInput,
) {
  const path = `/kandidat/${encodeURIComponent(candidateId)}`;
  const r = await attempt(async () => {
    await api<Candidate>(`${path}/keputusan`, {
      method: "PATCH",
      body: {
        category: input.category,
        reason: input.reason,
        decision: input.decision,
      },
    });
    return api<Candidate>(`${path}/feedback`, {
      method: "POST",
      body: { content: input.feedback, reviewed: true },
    });
  });
  if (r.ok) refresh();
  return r;
}
