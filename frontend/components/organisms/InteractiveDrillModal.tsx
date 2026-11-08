import { useState } from "react";
import { X, CheckCircle, WarningCircle, Lightning } from "@phosphor-icons/react";
import { ILearningDrill, IDrillSubmissionResult } from "@/lib/data/learning/types";
import dashboard from "@/styles/dashboard.module.css";

export interface InteractiveDrillModalProps {
  drill: ILearningDrill;
  onClose: () => void;
  onSubmit: (optionIndex: number) => Promise<void>;
  isSubmitting: boolean;
  result: IDrillSubmissionResult | null;
}

export function InteractiveDrillModal({
  drill,
  onClose,
  onSubmit,
  isSubmitting,
  result,
}: InteractiveDrillModalProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleSubmit = async () => {
    if (selectedIndex === null || isSubmitting) return;
    await onSubmit(selectedIndex);
  };

  return (
    <div className={dashboard.modalOverlay} role="dialog" aria-modal="true">
      <div className={dashboard.modalCard}>
        <div className={dashboard.modalHeader}>
          <div className={dashboard.modalHeaderLeft}>
            <span className={dashboard.drillBadge}>
              <Lightning size={14} weight="bold" color="var(--ink)" />
              Drill Studi Kasus (+{drill.readinessBoost} Poin)
            </span>
            <span className={dashboard.targetCompBadge}>{drill.targetCompetency}</span>
          </div>
          <button
            type="button"
            className={dashboard.modalCloseBtn}
            onClick={onClose}
            aria-label="Tutup modal"
          >
            <X size={20} weight="bold" />
          </button>
        </div>

        <div className={dashboard.modalBody}>
          <div className={dashboard.scenarioBox}>
            <span className={dashboard.scenarioLabel}>Konteks Lapangan:</span>
            <p className={dashboard.scenarioText}>{drill.scenario}</p>
          </div>

          <div className={dashboard.problemBox}>
            <h4 className={dashboard.problemTitle}>{drill.problemStatement}</h4>
          </div>

          <div className={dashboard.optionsList}>
            {drill.options.map((opt) => {
              const isSelected = selectedIndex === opt.index;
              const isCorrectOption = result && opt.index === drill.correctIndex;
              const isWrongSelected = result && isSelected && !result.isCorrect;

              let optionStyle = dashboard.optionItem;
              if (isSelected) optionStyle = dashboard.optionItemSelected;
              if (isCorrectOption) optionStyle = dashboard.optionItemCorrect;
              if (isWrongSelected) optionStyle = dashboard.optionItemWrong;

              return (
                <button
                  key={opt.index}
                  type="button"
                  className={optionStyle}
                  disabled={result !== null || isSubmitting}
                  onClick={() => setSelectedIndex(opt.index)}
                >
                  <span className={dashboard.optionIdx}>
                    {String.fromCharCode(65 + opt.index)}
                  </span>
                  <span className={dashboard.optionText}>{opt.text}</span>
                </button>
              );
            })}
          </div>

          {result && (
            <div
              className={
                result.isCorrect ? dashboard.resultSuccess : dashboard.resultWarning
              }
            >
              <div className={dashboard.resultHeader}>
                {result.isCorrect ? (
                  <>
                    <CheckCircle size={20} weight="bold" />
                    <strong>Jawaban Tepat! (+{result.pointsEarned} Poin Kesiapan)</strong>
                  </>
                ) : (
                  <>
                    <WarningCircle size={20} weight="bold" />
                    <strong>Perlu Pendalaman Lebih Lanjut</strong>
                  </>
                )}
              </div>
              <p className={dashboard.resultExplanation}>{result.explanation}</p>
            </div>
          )}
        </div>

        <div className={dashboard.modalFooter}>
          <button type="button" className={dashboard.btnCancel} onClick={onClose}>
            {result ? "Tutup" : "Batal"}
          </button>

          {!result ? (
            <button
              type="button"
              className={dashboard.btnSubmitDrill}
              disabled={selectedIndex === null || isSubmitting}
              onClick={handleSubmit}
            >
              {isSubmitting ? "Mengevaluasi..." : "Kirim Jawaban Drill"}
            </button>
          ) : (
            <button type="button" className={dashboard.btnSubmitDrill} onClick={onClose}>
              Selesai & Lanjut
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default InteractiveDrillModal;
