import { Badge } from "../atoms/Badge";
import { Panel } from "../molecules/Panel";
import { Stat } from "../molecules/Stat";
import { StatGrid } from "../molecules/StatGrid";
import { ReadinessProfile } from "@/lib/data/readiness/types";
import { CATEGORY_TONE, Tone } from "@/lib/tone";

export interface ReadinessScoreOverviewProps {
  profile: ReadinessProfile;
  availablePositions?: readonly string[];
  selectedPosition?: string;
  onPositionChange?: (position: string) => void;
}

export function ReadinessScoreOverview({
  profile,
  availablePositions,
  selectedPosition,
  onPositionChange,
}: ReadinessScoreOverviewProps) {
  const categoryTone: Tone =
    CATEGORY_TONE[profile.overallCategory] ??
    (profile.overallScore >= 80
      ? "green"
      : profile.overallScore >= 65
      ? "yellow"
      : "orange");

  const positionValue =
    availablePositions && onPositionChange ? (
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        <select
          value={selectedPosition || profile.targetPosition}
          onChange={(e) => onPositionChange(e.target.value)}
          aria-label="Ganti Posisi Sasaran Karier"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "14px",
            fontWeight: 700,
            border: "1px solid var(--ink)",
            background: "var(--surface)",
            padding: "4px 8px",
            color: "var(--ink)",
            cursor: "pointer",
            width: "100%",
            maxWidth: "320px",
          }}
        >
          {availablePositions.map((pos) => (
            <option key={pos} value={pos}>
              {pos}
            </option>
          ))}
        </select>
        <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
          Ubah fokus target untuk evaluasi spesifik
        </span>
      </div>
    ) : (
      profile.targetPosition || "Frontend Developer"
    );

  return (
    <Panel title="Indeks Kesiapan Kerja Mahasiswa" tag="Evaluasi Berbasis Bukti" flush>
      <StatGrid cols={3}>
        <Stat
          label="Posisi Sasaran Karier"
          value={positionValue}
        />
        <Stat
          label="Indeks Kesiapan"
          value={`${profile.overallScore.toFixed(1)} / 100`}
        />
        <Stat
          label="Status Rekomendasi"
          value={<Badge tone={categoryTone}>{profile.overallCategory}</Badge>}
        />
      </StatGrid>

      <div
        style={{
          padding: "14px 20px",
          borderTop: "var(--border)",
          background: "var(--surface-warm)",
          fontSize: "13px",
          color: "var(--text-muted)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "8px",
        }}
      >
        <span>
          Skor dihitung dinamis dari bukti nyata portofolio, magang industri, jawaban wawancara AI, dan drill kompetensi.
        </span>
        <span style={{ fontFamily: "var(--font-mono)", fontWeight: 600, color: "var(--ink)" }}>
          Ambang minimum seleksi kerja: 80.0
        </span>
      </div>
    </Panel>
  );
}
