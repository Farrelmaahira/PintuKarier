export interface ReadinessDimension {
  name: string;
  weight: number;
  score: number;
  evidence: string;
  description: string;
}

export interface ReadinessCompetency {
  name: string;
  category: string;
  level: string;
  progress: number;
  evidenceSrc: string;
}

export interface ReadinessHistoryEntry {
  date: string;
  score: number;
  change: number;
  eventName: string;
  description: string;
}

export interface ReadinessActionRecommendation {
  id: string;
  title: string;
  type: string;
  potentialUp: number;
  actionUrl: string;
  priority: string;
}

export interface ReadinessProfile {
  studentId: string;
  overallScore: number;
  overallCategory: string;
  targetPosition: string;
  dimensions: ReadinessDimension[];
  competencies: ReadinessCompetency[];
  progressHistory: ReadinessHistoryEntry[];
  actionRecommendations: ReadinessActionRecommendation[];
}

export interface ReadinessTrackerState {
  profile: ReadinessProfile | null;
  isLoading: boolean;
  error: string | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  targetPosition: string;
  setTargetPosition: (position: string) => void;
  availablePositions: readonly string[];
  refreshReadiness: () => Promise<void>;
}
