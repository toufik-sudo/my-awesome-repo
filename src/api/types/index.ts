// -----------------------------------------------------------------------------
// API Types and Interfaces
// Shared types for API responses and requests
// -----------------------------------------------------------------------------

// Pagination
export interface IPageableResult<T> {
  entries: T[];
  total: number;
}

export interface IPaginationParams {
  size?: number;
  offset?: number;
  sortBy?: string;
  sortDirection?: 'ASC' | 'DESC';
}

// User types
export interface IUser {
  id: number;
  uuid: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  dateOfBirth?: string;
  avatarUrl?: string;
  status?: number;
  step?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface IUserSearchCriteria extends IPaginationParams {
  platform?: number;
  program?: number;
  search?: string;
  view?: string;
  filters?: {
    program?: number;
    status?: number[];
    peopleManager?: number;
  };
}

export interface IUserDetails extends IUser {
  platforms?: IPlatform[];
  programs?: IProgram[];
  points?: number;
  ranking?: number;
}

// Platform types
export interface IPlatform {
  id: number;
  name: string;
  description?: string;
  logo?: string;
  platformType?: {
    id: number;
    name: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface IPlatformType {
  id: number;
  name: string;
  description?: string;
  price?: number;
  features?: string[];
}

// Program types
export interface IProgram {
  id: number;
  name: string;
  description?: string;
  platformId: number;
  startDate?: string;
  endDate?: string;
  status?: number;
  pointsType?: string;
  rules?: string;
  resultsFormFields?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface IProgramDetails extends IProgram {
  platform?: IPlatform;
  participantsCount?: number;
  declarations?: number;
}

// Declaration types
export enum DeclarationStatus {
  PENDING = 1,
  VALIDATED = 2,
  DECLINED = 3
}

export enum DeclarationStatusOperation {
  VALIDATE = 'validate',
  DECLINE = 'decline'
}

export interface IDeclaration {
  id: number;
  userId: number;
  programId: number;
  status: DeclarationStatus;
  hash?: string;
  proofFileId?: number;
  data?: Record<string, unknown>;
  createdAt?: string;
  updatedAt?: string;
  validatedAt?: string;
  validatedBy?: number;
}

export interface IDeclarationSearchCriteria extends IPaginationParams {
  platform?: number;
  program?: number;
  user?: string;
  status?: DeclarationStatus[];
  view?: string;
}

export interface IDeclarationCreate {
  programId: number;
  data: Record<string, unknown>;
  proofOfSale?: File;
}

export interface IDeclarationValidation {
  id: number;
  hash: string;
  operation: DeclarationStatusOperation;
}

export interface INote {
  id: number;
  userDeclarationId: number;
  text: string;
  createdAt?: string;
  createdBy?: number;
}

// File types
export interface IFileUpload {
  file: File;
  filename: string;
  type: number;
}

export interface IFileDownload {
  file: Blob;
  filename: string;
  contentType: string;
}

// Ranking types
export interface IUserRanking {
  userId: number;
  userName: string;
  points: number;
  rank: number;
  programId?: number;
}

export interface IRankingSearchCriteria extends IPaginationParams {
  platformId?: number;
  programId?: number;
  period?: string;
}

// Post types
export interface IPostSearchCriteria extends IPaginationParams {
  platform?: number;
  program?: number;
  type?: number;
  view?: string;
  startDate?: Date;
  endDate?: Date;
}

// Period type
export interface IPeriod {
  startDate: Date;
  endDate: Date;
}

// Category search
export interface ICategorySearch {
  platform?: number;
  program?: number;
  search?: string;
}

// API Response wrapper
export interface IApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface IApiError {
  code: number;
  message: string;
  details?: Record<string, unknown>;
}
