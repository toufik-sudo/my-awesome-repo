import { IPriceObject } from 'interfaces/containers/ILandingPricingContainer';
import { IArrayKey } from '../IGeneral';
import { ILanguageOption } from './actions/ILanguageActions';
import { IProgram, IPlatform, IProgramPoints, IPlatformPoints } from 'interfaces/components/wall/IWallPrograms';
import { ISortable } from 'interfaces/api/ISortable';
import { ROLE } from 'constants/security/access';
import { PLATFORM_HIERARCHIC_TYPE } from 'constants/platforms';

export interface ILanguageReducer {
  selectedLanguage: ILanguageOption;
  messages: IArrayKey<string>;
}

export interface IGeneralReducer {
  globalLoading: boolean;
  userLoggedIn: boolean;
  redirectOnLogin: boolean;
}

export interface ILandingReducer {
  pricingData: IPriceObject[];
}

export interface IModalState {
  active: boolean;
  data: IArrayKey<any>;
}

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

export interface IStore {
  languageReducer: ILanguageReducer;
  generalReducer: IGeneralReducer;
  landingReducer: ILandingReducer;
  modalReducer: IModalReducer;
  launchReducer: IArrayKey<any>;
  wallReducer: IWallReducer;
  userDeclarationReducer: IUserDeclarationReducer;
  onboardingReducer: IOnboardingReducer;
}

export interface IAction<Payload> {
  type: string;
  payload?: Payload;
}

export interface IProgramUsers {
  programId: number;
  total: number;
}

export interface IProgramRanking {
  id: number;
  rank: number;
  name?: string;
  nameId?: string;
  points?: number;
  converted?: number;
}

export interface IPlatformRanking {
  id: number;
  averageRank: number;
  programs: IProgramRanking[];
}

export interface IWallReducer {
  programs: IProgram[];
  platforms: IPlatform[];
  superPlatforms: IPlatform[];
  loadingPlatforms: boolean;
  programUsers: { data: IProgramUsers[]; total: number };
  selectedProgramId: any;
  selectedProgramIndex: any;
  redirectData: any;
  selectedProgramName: any;
  selectedPlatform: {
    index?: number;
    name?: string;
    id?: number;
    role?: ROLE;
    status?: number | null;
    hierarchicType?: PLATFORM_HIERARCHIC_TYPE;
  };
  agenda: { reload: boolean };
  isProgramSelectionLocked: boolean;
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
  programDetails: { [programId: number]: any };
  didLoad: boolean;
  
}

export interface IUserDeclarationReducer {
  listSorting?: ISortable;
}

interface IRegisterStepsData {
  title: string;
  firstName: string;
  lastName: string;
  email: string;
  createAccountPassword: string;
  passwordConfirmation: string;
  type: number;
  croppedAvatar: string;
  fullAvatar: string;
  avatarConfig: string;
}

export interface IOnboardingReducer {
  registerData: IRegisterStepsData;
}
