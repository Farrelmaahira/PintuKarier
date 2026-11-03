import Link from "next/link";
import { ArrowRight, Lightning } from "@phosphor-icons/react";
import { ReadinessActionRecommendation } from "@/lib/data/readiness/types";
import { Badge } from "../atoms/Badge";
import dashboard from "@/styles/dashboard.module.css";
import ui from "@/styles/ui.module.css";

export interface ReadinessActionRecommendationsProps {
  recommendations: ReadinessActionRecommendation[];
}

export function ReadinessActionRecommendations({
  recommendations,
}: ReadinessActionRecommendationsProps) {
  return (
    <div className={ui.card}>
      <div className={dashboard.cardHeaderRow}>
        <div>
          <h2 className={ui.cardTitle}>Langkah Belajar Rekomendasi AI</h2>
          <span className={ui.cardSub}>
            Tindakan prioritas untuk menaikkan skor menuju ambang Memenuhi Kriteria (80.0+).
          </span>
        </div>
        <Lightning size={22} color="var(--accent)" aria-hidden />
      </div>

      <div className={dashboard.recList}>
        {recommendations.map((rec) => (
          <div key={rec.id} className={dashboard.recCard}>
            <div className={dashboard.recLeft}>
              <div className={dashboard.recBadges}>
                <Badge tone="var(--accent)">{rec.type}</Badge>
                <span className={dashboard.gainBadge}>+{rec.potentialUp} Poin Kesiapan</span>
              </div>
              <h3 className={dashboard.recTitle}>{rec.title}</h3>
            </div>

            <div className={dashboard.recRight}>
              <Link href={rec.actionUrl} className={dashboard.recBtn}>
                Mulai Tindak Lanjut <ArrowRight size={16} aria-hidden />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
