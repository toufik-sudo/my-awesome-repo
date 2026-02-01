// -----------------------------------------------------------------------------
// Store Types
// Migrated from old_app/src/interfaces/store/IStore.ts
// -----------------------------------------------------------------------------

import { ILanguageOption } from '@/constants/i18n';
import { IWallState, IProgram, IPlatform, IProgramPoints, IPlatformPoints } from '@/features/wall/types';
import { ISortable } from '@/features/declarations/types';
import { ROLE } from '@/constants/security/access';
import { PLATFORM_HIERARCHIC_TYPE } from '@/constants/platforms';

// Generic types
export interface IArrayKey<T> {
  [key: string]: T;
}

export type TDynamicObject = Record<string, unknown>;

// Price object for landing page
export interface IPriceObject {
  id: number;
  title: string;
  price: number;
  features: string[];
}

// Language reducer state
export interface ILanguageReducer {
  selectedLanguage: ILanguageOption;
  messages: Record<string, string>;
}

// General reducer state
export interface IGeneralReducer {
  globalLoading: boolean;
  userLoggedIn: boolean;
  redirectOnLogin: boolean;
}

// Landing reducer state
export interface ILandingReducer {
  pricingData: IPriceObject[];
}

// Modal state
export interface IModalState {
  active: boolean;
  data: Record<string, unknown>;
}

// Modal reducer state
export interface IModalReducer {
  confirmationModal: IModalState;
  resellerModal: IModalState;
  successModal: IModalState;
  loginModal: IModalState;
  passwordReset: IModalState;
  fraudInfoModal: IModalState;
  imageUploadModal: IModalState;
  designCoverModal: IModalState;
  contentsCoverModal: IModalState;
  designAvatarModal: IModalState;
  logOutModal: IModalState;
  addUserDeclarationModal: IModalState;
  authorizeModal: IModalState;
  likesModal: IModalState;
  blockUserModal: IModalState;
  userProgramRoleModal: IModalState;
  createPlatformModal: IModalState;
  validatePointConversionModal: IModalState;
  tcPdfModal: IModalState;
  changeZoneModal: IModalState;
}

// Program users
export interface IProgramUsers {
  programId: number;
  total: number;
}

// Program ranking
export interface IProgramRanking {
  id: number;
  rank: number;
  name?: string;
  nameId?: string;
  points?: number;
  converted?: number;
}

// Platform ranking
export interface IPlatformRanking {
  id: number;
  averageRank: number;
  programs: IProgramRanking[];
}

// Wall reducer state (extended version with all legacy fields)
export interface IWallReducerFull extends IWallState {
  superPlatforms: IPlatform[];
  programUsers: { data: IProgramUsers[]; total: number };
  redirectData: Record<string, unknown>;
  agenda: { reload: boolean };
  linkedEmailsData: string[];
  beneficiaryPoints: {
    selectedBeneficiaryPoints: IProgramPoints;
    platformProgramsPointsList: IProgramPoints[];
    totalPlatformsPoints: IPlatformPoints[];
    reloadKey: number;
  };
  userRankings: {
    selectedRanking: IProgramRanking;
    allRankings: IPlatformRanking[];
    programRankings: IProgramRanking[];
  };
  didLoad: boolean;
}

// User declaration reducer state
export interface IUserDeclarationReducer {
  listSorting?: ISortable;
}

// Register steps data
export interface IRegisterStepsData {
  title: string | null;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  createAccountPassword: string | null;
  passwordConfirmation: string | null;
  type: number;
  croppedAvatar: string | null;
  fullAvatar: string | null;
  avatarConfig: string | null;
}

// Onboarding reducer state
export interface IOnboardingReducer {
  registerData: IRegisterStepsData;
}

// Launch reducer state
export interface ILaunchReducer {
  [key: string]: unknown;
}

// Redux action interface
export interface IAction<Payload> {
  type: string;
  payload?: Payload;
}
