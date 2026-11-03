export interface AdminDepartmentSummary {
  departmentCode: string;
  departmentName: string;
  totalStudents: number;
  totalApplicants: number;
  readinessLevel: number;
  competencyGaps: string[];
  partnerCount: number;
}

export interface AdminPartnerSummary {
  id: string;
  companyName: string;
  industrySector: string;
  vacancyCount: number;
  applicantCount: number;
  feedbackSent: number;
  feedbackSla: number;
  partnershipStatus: string;
}

export interface AdminOverviewStats {
  totalStudents: number;
  totalVacancies: number;
  totalPartners: number;
  totalApplications: number;
  feedbackRate: number;
  avgReadiness: number;
  departmentSummaries: AdminDepartmentSummary[];
}

export interface AdminCareerCenterState {
  overview: AdminOverviewStats | null;
  departments: AdminDepartmentSummary[];
  partners: AdminPartnerSummary[];
  isLoading: boolean;
  error: string | null;
  activeDepartmentFilter: string;
  partnerSearchQuery: string;
  filteredPartners: AdminPartnerSummary[];
  setDepartmentFilter: (code: string) => void;
  setPartnerSearchQuery: (query: string) => void;
  refreshData: () => Promise<void>;
}
