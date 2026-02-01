// -----------------------------------------------------------------------------
// AI Feature Types
// Migrated from old_app/src/components/pages/programs/ia/AiInterface.ts
// -----------------------------------------------------------------------------

/**
 * AI Personalization profile response from API
 */
export interface IAiPersoProfile {
  id?: number;
  iaProjectId?: string;
  iaType?: string;
  iaName?: string;
  tone?: string;
  theValues?: string;
  favoriteDishes?: string;
  rhythm?: string;
  favoriteColor?: string;
  socialActivities?: string;
  favoriteMusicStyle?: string;
  favoriteSport?: string;
  sportsTeam?: string;
  petName?: string;
  entertainmentPreferences?: string;
  topThreeFavoriteBooks?: string;
  favoriteDestination?: string;
  shortBiography?: string;
  introductions?: string;
  universe?: string;
  expressions?: string;
  status?: string;
  comment?: string;
  iaPersoExpireDate?: string;
  iaPersoDueDate?: string;
  iaPersoLogoUrl?: string;
  userUuid?: string;
  iaId?: number;
}

/**
 * AI Training course for a company program
 */
export interface IAiTrainingCourse {
  iaTrainingName?: string;
  iaStatus?: string;
  iaTrainingDueDate?: string;
  iaTrainingExpireDate?: string;
  iaComment?: string;
  iaTrainingType?: string;
}

/**
 * AI Company Program configuration
 */
export interface IAiCompanyProgram {
  iaName?: string;
  iaProjectId?: string;
  iaType?: string;
  iaComment?: string;
  iaExpireDate?: string;
  iaDueDate?: string;
  iaStatus?: string;
  iaTrainingCompany?: IAiTrainingCourse[];
  iaAudioOn?: boolean;
}

/**
 * Response wrapper for AI profiles
 */
export interface IAiPersoResponse {
  data: IAiPersoProfile[];
}

/**
 * Request payload for creating/updating AI profile
 */
export interface IAiPersoRequest {
  iaId?: number;
  iaName: string;
  iaType?: string;
  iaProjectId?: string;
  userUuid: string;
  tone?: string;
  theValues?: string;
  favoriteDishes?: string;
  rhythm?: string;
  favoriteColor?: string;
  socialActivities?: string;
  favoriteMusicStyle?: string;
  favoriteSport?: string;
  sportsTeam?: string;
  petName?: string;
  entertainmentPreferences?: string;
  topThreeFavoriteBooks?: string;
  favoriteDestination?: string;
  shortBiography?: string;
  introductions?: string;
  universe?: string;
  expressions?: string;
  status?: string;
  comment?: string;
  iaPersoExpireDate?: string;
  iaPersoDueDate?: string;
  iaPersoLogoUrl?: string;
  isIaPersoUpdate?: boolean;
}

/**
 * Admin program with AI association
 */
export interface IAiAdminProgram {
  id?: number;
  name?: string;
  iaName?: string;
  iaType?: string;
  companyName?: string;
  programName?: string;
}

/**
 * RAG Index document entry
 */
export interface IRagIndexDoc {
  categoryToIndex: string;
  filenameToIndex?: string;
  urlToIndex?: string;
  isIndexBlocked: boolean;
  status: string;
  isCommon: boolean;
  isIaStar: boolean;
  comment: string;
  errorCode?: string;
  errorMsg?: string;
  isIndexReseted: boolean;
  programId: string;
  programName: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * RAG Category configuration for indexation
 */
export interface IRagCategory {
  id: string;
  catName: string;
  disabled: boolean;
  isActivatedReset: boolean;
}

/**
 * AI Types available in the system
 */
export const AI_TYPES = [
  { name: 'OLYMPE', value: 'Olympe' },
  { name: 'IA_STAR', value: 'IA Star' },
  { name: 'OLYMPE_ACADEMY', value: 'Olympe Academy' },
  { name: 'IA_STAR_ACADEMY', value: 'IA Star Academy' },
  { name: 'THEMIS', value: 'Thémis' },
] as const;

export type AiTypeName = typeof AI_TYPES[number]['name'];

/**
 * RAG Categories for indexation
 */
export const RAG_CATEGORIES: IRagCategory[] = [
  { id: 'ai.question1', catName: 'products', disabled: false, isActivatedReset: false },
  { id: 'ai.question2', catName: 'prices', disabled: false, isActivatedReset: false },
  { id: 'ai.question3', catName: 'technical_manuals', disabled: false, isActivatedReset: false },
  { id: 'ai.question4', catName: 'legals', disabled: false, isActivatedReset: false },
  { id: 'ai.question5', catName: 'compititions', disabled: false, isActivatedReset: false },
  { id: 'ai.question6', catName: 'history', disabled: false, isActivatedReset: false },
  { id: 'ai.question7', catName: 'values', disabled: false, isActivatedReset: false },
  { id: 'ai.question8', catName: 'news', disabled: false, isActivatedReset: false },
];

export const RAG_COMMON_CATEGORIES: IRagCategory[] = [
  { id: 'ai.common.question1', catName: 'common_company', disabled: false, isActivatedReset: false },
  { id: 'ai.common.iaStar', catName: 'common_ia_star', disabled: false, isActivatedReset: false },
];
