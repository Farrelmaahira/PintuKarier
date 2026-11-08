package domain

import "time"

// ReadinessProfile profil kesiapan kerja mahasiswa vokasi berbasis bukti.
type ReadinessProfile struct {
	StudentID             string                         `json:"student_id"`
	OverallScore          float64                        `json:"overall_score"`
	OverallCategory       string                         `json:"overall_category"`
	TargetPosition        string                         `json:"target_position"`
	Dimensions            []ReadinessDimension           `json:"dimensions"`
	Competencies          []ReadinessCompetency          `json:"competencies"`
	ProgressHistory       []ReadinessHistoryEntry        `json:"progress_history"`
	ActionRecommendations []ReadinessActionRecommendation `json:"action_recommendations"`
}

type ReadinessDimension struct {
	Name        string  `json:"name"`
	Weight      float64 `json:"weight"`
	Score       float64 `json:"score"`
	Evidence    string  `json:"evidence"`
	Description string  `json:"description"`
}

type ReadinessCompetency struct {
	Name        string  `json:"name"`
	Category    string  `json:"category"`
	Level       string  `json:"level"`
	Progress    float64 `json:"progress"`
	EvidenceSrc string  `json:"evidence_src"`
}

type ReadinessHistoryEntry struct {
	Date        time.Time `json:"date"`
	Score       float64   `json:"score"`
	Change      float64   `json:"change"`
	EventName   string    `json:"event_name"`
	Description string    `json:"description"`
}

type ReadinessActionRecommendation struct {
	ID          string `json:"id"`
	Title       string `json:"title"`
	Type        string `json:"type"`
	PotentialUp int    `json:"potential_up"`
	ActionURL   string `json:"action_url"`
	Priority    string `json:"priority"`
}
