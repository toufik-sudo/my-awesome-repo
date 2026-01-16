import { PLATFORM_HIERARCHIC_TYPE } from 'constants/platforms';

export interface IProgram {
  id: number;
  name: string;
  programType?: number;
  programStatus?: number;
  isOpen?: boolean;
  isPeopleManager?: boolean;
  design?: any;
  uploadResultsFile: boolean;
  resultsDeclarationForm: boolean;
  status?: string;
  subscribed?: boolean;
  visitedWall?: boolean;
  startDate?: Date;
}

export interface ISelectedProgram {
  selectedProgramId: string;
  selectedProgramName: string;
  selectedProgramIndex?: number;
}

export interface IPlatformType {
  name: string;
  id: number;
}

export interface IPlatform {
  nrOfPrograms: number;
  id: number;
  name: string;
  role: number;
  status: number;
  hierarchicType: PLATFORM_HIERARCHIC_TYPE;
  programs: IProgram[];
  subPlatforms?: IPlatform[];
  platformType: IPlatformType;
}

export interface IProgramPoints {
  id: number;
  name: string;
  converted: number;
  points: number;
  platformId: number;
}

export interface IPlatformPoints {
  id: number;
  points: number;
}
export interface IBlocsData {
  menuTitle?: string;
  bannerTitle?: string;
  pictureId?: string;
  pictureUrl?: string;
  content?: string;
}
