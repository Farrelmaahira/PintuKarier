export interface RankingGroup {
  count: number;
  items: [string, number][];
}

/** Per periode dan posisi, bentuknya sama dengan GET /prodi/{id}/ranking. */
export type Ranking = Record<string, Record<string, RankingGroup>>;

export interface FollowUpNote {
  id?: string;
  competency: string;
  course: string;
  action: string;
  author: string;
  date: string;
  status: "Direncanakan" | "Berjalan" | "Selesai";
}

export interface CurriculumRecommendation {
  id: string;
  competency: string;
  course: string;
  semester: number;
  deficit: string;
  newModules: {
    title: string;
    description: string;
    schedule: string;
  }[];
  pblProject: string;
  partnerCertification: string;
}
