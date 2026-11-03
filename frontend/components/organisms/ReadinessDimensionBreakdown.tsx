import { ReadinessDimension } from "@/lib/data/readiness/types";
import dashboard from "@/styles/dashboard.module.css";
import ui from "@/styles/ui.module.css";

export interface ReadinessDimensionBreakdownProps {
  dimensions: ReadinessDimension[];
}

export function ReadinessDimensionBreakdown({ dimensions }: ReadinessDimensionBreakdownProps) {
  return (
    <div className={ui.card}>
      <div className={dashboard.cardHeaderRow}>
        <div>
          <h2 className={ui.cardTitle}>Rincian 5 Dimensi Penilaian Berbasis Bukti</h2>
          <span className={ui.cardSub}>
            Tiap dimensi memiliki bobot tetap sesuai standar evaluasi rekrutmen vokasi.
          </span>
        </div>
      </div>

      <div className={dashboard.dimList}>
        {dimensions.map((dim) => (
          <div key={dim.name} className={dashboard.dimItem}>
            <div className={dashboard.dimHeader}>
              <div className={dashboard.dimTitleCol}>
                <h3 className={dashboard.dimName}>{dim.name}</h3>
                <span className={dashboard.dimWeightBadge}>Bobot {dim.weight}%</span>
              </div>
              <div className={dashboard.dimScoreCol}>
                <span className={dashboard.dimScoreVal}>{dim.score.toFixed(1)}</span>
                <span className={dashboard.dimScoreMax}>/100</span>
              </div>
            </div>

            <div className={dashboard.dimBarTrack}>
              <div
                className={dashboard.dimBarFill}
                style={{ width: `${Math.min(dim.score, 100)}%` }}
              />
            </div>

            <div className={dashboard.dimEvidenceBlock}>
              <span className={dashboard.dimEvidenceLabel}>Bukti Terverifikasi:</span>
              <p className={dashboard.dimEvidenceText}>"{dim.evidence}"</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
