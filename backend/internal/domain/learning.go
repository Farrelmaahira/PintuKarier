package domain

type LearningModule struct {
	ID                   string   `json:"id"`
	Title                string   `json:"title"`
	Category             string   `json:"category"`
	Difficulty           string   `json:"difficulty"`
	DurationMinutes      int      `json:"duration_minutes"`
	Summary              string   `json:"summary"`
	CompetenciesCovered  []string `json:"competencies_covered"`
	EstimatedGain        int      `json:"estimated_gain"`
	Status               string   `json:"status"` // "recommended", "in_progress", "completed"
	ExternalResourceURL  string   `json:"external_resource_url"`
}

type LearningDrillOption struct {
	Index int    `json:"index"`
	Text  string `json:"text"`
}

type LearningDrill struct {
	ID               string                `json:"id"`
	ModuleID         string                `json:"module_id"`
	Scenario         string                `json:"scenario"`
	ProblemStatement string                `json:"problem_statement"`
	Options          []LearningDrillOption `json:"options"`
	CorrectIndex     int                   `json:"correct_index"`
	Explanation      string                `json:"explanation"`
	ReadinessBoost   int                   `json:"readiness_boost"`
	TargetCompetency string                `json:"target_competency"`
}

type DrillSubmissionResult struct {
	IsCorrect      bool   `json:"is_correct"`
	PointsEarned   int    `json:"points_earned"`
	Explanation    string `json:"explanation"`
	NewOverallScore int    `json:"new_overall_score"`
}

type LearningOverview struct {
	StudentID           string           `json:"student_id"`
	TotalModules        int              `json:"total_modules"`
	CompletedModules    int              `json:"completed_modules"`
	InProgressModules   int              `json:"in_progress_modules"`
	TotalScoreBoost     int              `json:"total_score_boost"`
	RecommendedCategory string           `json:"recommended_category"`
	Modules             []LearningModule `json:"modules"`
	ActiveDrills        []LearningDrill  `json:"active_drills"`
}
