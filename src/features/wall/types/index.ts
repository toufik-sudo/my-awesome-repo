// -----------------------------------------------------------------------------
// Wall Feature Types
// -----------------------------------------------------------------------------

import { PLATFORM_HIERARCHIC_TYPE } from '@/constants/platforms';
import { LucideIcon } from 'lucide-react';

// Navigation types
export interface NavItem {
  title: string;
  icon?: LucideIcon;
  url: string;
  external?: boolean;
  isDisabled?: boolean;
}

// Platform types
export interface IPlatformType {
  name: string;
  id: number;
}

export interface IProgram {
  id: number;
  name: string;
  programType?: number;
  programStatus?: number;
  isOpen?: boolean;
  isPeopleManager?: boolean;
  design?: IProgramDesign;
  uploadResultsFile: boolean;
  resultsDeclarationForm: boolean;
  status?: string;
  subscribed?: boolean;
  visitedWall?: boolean;
  startDate?: Date;
}

export interface IProgramDesign {
  colorSidebar?: string;
  colorBackground?: string;
  colorContent?: string;
  colorTask?: string;
  colorTitles?: string;
  colorMainButtons?: string;
  colorMenu?: string;
  colorFont?: string;
  font?: string;
  companyLogoUrl?: string;
  backgroundCoverUrl?: string;
  companyName?: string;
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

export interface ISelectedPlatform {
  index: number | null;
  name: string;
  id: number | undefined;
  role: number | undefined;
  status: number | null;
  hierarchicType: PLATFORM_HIERARCHIC_TYPE | undefined;
}

export interface IWallState {
  programs: IProgram[];
  platforms: IPlatform[];
  superPlatforms: IPlatform[];
  selectedProgramId: number | undefined;
  selectedProgramIndex: number | null;
  isProgramSelectionLocked: boolean;
  selectedProgramName: string;
  selectedProgramDetail: Record<string, unknown>;
  selectedPlatform: ISelectedPlatform;
  loadingPlatforms: boolean;
  programDetails: Record<number, IProgramDetail>;
}

export interface IProgramDetail {
  design?: IProgramDesign;
  type?: number;
  name?: string;
  status?: string;
  [key: string]: unknown;
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
