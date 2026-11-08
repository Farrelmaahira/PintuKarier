import { ArrowRight } from "@phosphor-icons/react";
import { ReadinessActionRecommendation } from "@/lib/data/readiness/types";
import type { Tone } from "@/lib/tone";
import { Badge } from "../atoms/Badge";
import { Button } from "../atoms/Button";
import { EmptyState } from "../molecules/EmptyState";
import { Panel } from "../molecules/Panel";
import rows from "@/styles/rows.module.css";

export interface ReadinessActionRecommendationsProps {
  recommendations: ReadinessActionRecommendation[];
}

const PRIORITY_TONE: Record<string, Tone> = { Tinggi: "orange", Sedang: "yellow" };

export function ReadinessActionRecommendations({ recommendations }: ReadinessActionRecommendationsProps) {
  return (
    <Panel title="Langkah Belajar dari AI" tag="Prioritas Kesiapan" flush>
      {recommendations.length === 0 ? (
        <EmptyState title="Belum ada rekomendasi">Rekomendasi muncul setelah ada bukti baru di portofolio kamu.</EmptyState>
      ) : (
        <ul className={rows.list}>
          {recommendations.map((rec) => (
            <li key={rec.id} className={`${rows.row} ${rows.single}`}>
              <div className={rows.main}>
                <strong>{rec.title}</strong>
                <div className={rows.top}>
                  <Badge tone="accent">{rec.type}</Badge>
                  <Badge tone="yellow">+{rec.potentialUp} Poin</Badge>
                  <Badge tone={PRIORITY_TONE[rec.priority] ?? "none"}>{rec.priority}</Badge>
                </div>
                <Button href={rec.actionUrl} size="sm" variant="ghost" block icon={<ArrowRight size={16} />}>
                  Mulai Tindak Lanjut
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}
