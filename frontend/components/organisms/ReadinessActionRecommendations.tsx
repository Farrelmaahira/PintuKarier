import { ArrowRight } from "@phosphor-icons/react";
import { ReadinessActionRecommendation } from "@/lib/data/readiness/types";
import { Badge } from "../atoms/Badge";
import { Button } from "../atoms/Button";
import { Panel } from "../molecules/Panel";
import rows from "@/styles/rows.module.css";

export interface ReadinessActionRecommendationsProps {
  recommendations: ReadinessActionRecommendation[];
}

export function ReadinessActionRecommendations({
  recommendations,
}: ReadinessActionRecommendationsProps) {
  return (
    <Panel
      title="Langkah Belajar Rekomendasi AI"
      tag="Prioritas Kesiapan"
      flush
    >
      <ul className={rows.list}>
        {recommendations.map((rec) => (
          <li key={rec.id} className={rows.row} style={{ gridTemplateColumns: "1fr auto" }}>
            <div className={rows.main} style={{ gap: "4px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <strong style={{ fontSize: "15px" }}>{rec.title}</strong>
                <Badge tone="accent">{rec.type}</Badge>
                <Badge tone="yellow">+{rec.potentialUp} Poin</Badge>
              </div>
              <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                Prioritas: {rec.priority}
              </span>
            </div>

            <div>
              <Button href={rec.actionUrl} size="sm" icon={<ArrowRight size={16} />}>
                Mulai Tindak Lanjut
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </Panel>
  );
}
