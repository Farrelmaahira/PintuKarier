import { HeroPieceImage } from "../atoms/HeroPieceImage";
import landing from "@/styles/landing.module.css";

const DECORATIONS = [
  { name: "tumpukan-cv", left: 0, top: 6, width: 26, rotate: -6, wiggle: 6 },
  { name: "laptop", left: 56, top: 76, width: 26, rotate: 0, wiggle: 4 },
];

interface HeroIllustrationProps {
  status: { label: string; tone: string };
}

/** Ilustrasi hero yang di-pin; potongannya digerakkan tahap lewat data-attribute (lib/motion/heroTransitions). */
export function HeroIllustration({ status }: HeroIllustrationProps) {
  return (
    <div className={`${landing.heroStage} graph-paper`}>
      <div className={landing.heroSticky}>
        <div className={landing.heroArt} aria-hidden>
          {DECORATIONS.map((piece) => (
            <div
              key={piece.name}
              className={landing.piece}
              data-piece
              style={{ left: `${piece.left}%`, top: `${piece.top}%`, width: `${piece.width}%`, zIndex: 1, rotate: `${piece.rotate}deg` }}
            >
              <div data-wiggle={piece.wiggle}>
                <HeroPieceImage name={piece.name} />
              </div>
            </div>
          ))}
          <div className={landing.piece} data-piece data-cv style={{ left: "16%", top: "22%", width: "60%", zIndex: 2 }}>
            <HeroPieceImage name="cv" priority />
            <span className={landing.inkMark} data-ink>
              Lolos seleksi
            </span>
          </div>
          <div className={landing.piece} data-piece style={{ left: "74%", top: "0%", width: "22%", zIndex: 5, rotate: "12deg" }}>
            <div data-clip>
              <div data-wiggle="7">
                <HeroPieceImage name="penjepit" />
              </div>
            </div>
          </div>
          <div className={landing.piece} data-piece style={{ left: "4%", top: "60%", width: "30%", zIndex: 3 }}>
            <div data-token>
              <div data-wiggle="5">
                <HeroPieceImage name="kartu" />
              </div>
            </div>
          </div>
          <div className={landing.piece} data-piece style={{ left: "68%", top: "44%", width: "32%", zIndex: 3, rotate: "6deg" }}>
            <div data-pen>
              <HeroPieceImage name="pulpen" />
            </div>
          </div>
          <div className={landing.piece} data-piece data-stamp style={{ left: "50%", top: "2%", width: "28%", zIndex: 4 }}>
            <span data-stamp-body className={landing.stampBody}>
              <HeroPieceImage name="stempel" />
            </span>
          </div>
          <span className={landing.payout} data-score>
            Skor 87/100 · Memenuhi Kriteria
          </span>
          <span className={landing.payout} data-prodi style={{ left: "6%", top: "8%", background: "var(--cat-yellow)" }}>
            Masuk Dasbor Prodi · anonim
          </span>
        </div>
        <div className={landing.sceneBar} role="status" aria-live="polite">
          <span className={landing.sceneLabel}>Status lamaran</span>
          <span className={landing.sceneStatus} data-status style={{ background: status.tone }}>
            {status.label}
          </span>
        </div>
      </div>
    </div>
  );
}
