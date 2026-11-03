export interface ILearningModule {
  id: string;
  title: string;
  category: string;
  difficulty: "Dasar" | "Menengah" | "Lanjutan";
  durationMinutes: number;
  summary: string;
  competenciesCovered: string[];
  estimatedGain: number;
  status: "recommended" | "in_progress" | "completed";
  externalResourceUrl: string;
}

export interface ILearningDrillOption {
  index: number;
  text: string;
}

export interface ILearningDrill {
  id: string;
  moduleId: string;
  scenario: string;
  problemStatement: string;
  options: ILearningDrillOption[];
  correctIndex: number;
  explanation: string;
  readinessBoost: number;
  targetCompetency: string;
}

export interface IDrillSubmissionResult {
  isCorrect: boolean;
  pointsEarned: number;
  explanation: string;
  newOverallScore: number;
}

export interface ILearningOverview {
  studentId: string;
  totalModules: number;
  completedModules: number;
  inProgressModules: number;
  totalScoreBoost: number;
  recommendedCategory: string;
  modules: ILearningModule[];
  activeDrills: ILearningDrill[];
}
