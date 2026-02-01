/**
 * Platform Selection Services
 * Migrated from old_app/src/services/PlatformSelectionServices.ts
 */

import { getSessionSelectedPlatform, updateSelectedPlatform } from '@/services/UserDataServices';
import { PLATFORM_HIERARCHIC_TYPE, PLATFORM_STATUS } from '@/constants/platforms';
import { isUserBeneficiary, hasAtLeastSuperRole } from '@/services/security/accessServices';
import { isSuperPlatform, isHyperPlatform } from '@/services/HyperProgramService';

// Types
export interface IProgram {
  id?: number;
  name: string;
  status?: string;
  [key: string]: any;
}

export interface IPlatform {
  id: number;
  name: string;
  programs: IProgram[];
  role: number;
  status?: string;
  platformType?: { name: string };
  hierarchicType: number;
  subPlatforms?: IPlatform[];
  [key: string]: any;
}

export interface ISelectionState {
  selectedPlatform?: {
    id?: number;
    name?: string;
    index?: number;
    role?: number;
    status?: string;
    hierarchicType?: number;
    platformType?: any;
  };
  selectedProgramIndex?: number;
  selectedProgramId?: number;
  selectedProgramName?: string;
  selectedPlatformName?: string;
  programs?: IProgram[];
}

// Constants
export const DEFAULT_ALL_PROGRAMS = 'All Programs';
export const PROGRAM_DETAILS_JOINED = 'joined';

export const initialSelectionState: ISelectionState = {
  selectedPlatform: undefined,
  selectedProgramIndex: 0,
  selectedProgramId: undefined,
  selectedProgramName: '',
  selectedPlatformName: ''
};

/**
 * Returns platformIndex and programIndex that contains the programId
 */
export const getForcedProgramIndexes = (
  platforms: IPlatform[],
  selectedProgramId: number,
  forcedPlatformId: number
): { programIndex: number; platformIndex: number } => {
  let programIndex = 0;
  const platformIndex = platforms.findIndex(({ programs, id }) => {
    if (forcedPlatformId && Number(forcedPlatformId) !== Number(id)) {
      return false;
    }

    programIndex = programs.findIndex(({ id }) => !selectedProgramId || Number(id) === Number(selectedProgramId));
    return programIndex >= 0 || !!forcedPlatformId;
  });

  return {
    programIndex: Math.max(programIndex, 0),
    platformIndex: Math.max(platformIndex, 0)
  };
};

/**
 * Returns the selected programIndex or default to 0
 */
const getSelectedProgramIndex = (programs: IProgram[], selectedProgramId: number): number => {
  return Math.max(
    programs.findIndex(({ id }) => Number(id) === Number(selectedProgramId)),
    0
  );
};

/**
 * Computes the current program index then sets the new cookie values and returns the set values
 */
export const handleSetActiveProgram = (
  programs: IProgram[],
  nextProgramId: number
): { selectedProgramIndex: number; selectedProgramId?: number; selectedProgramName: string } => {
  const selectedProgramIndex = getSelectedProgramIndex(programs, nextProgramId);
  const { name: selectedProgramName, id: selectedProgramId } = programs[selectedProgramIndex];
  
  updateSelectedPlatform({
    selectedProgramIndex,
    selectedProgramId,
    selectedProgramName
  });

  return { selectedProgramIndex, selectedProgramId, selectedProgramName };
};

/**
 * Computes platform/program selection state
 */
const handleSelectionUpdate = (
  platforms: IPlatform[],
  platformIndex: number,
  programIndex: number
): ISelectionState => {
  const selectedPlatform = platforms[platformIndex];
  const selectedProgram = selectedPlatform.programs[programIndex] || ({} as any);
  const { id, name, programs, role, status, platformType, hierarchicType } = selectedPlatform;

  const updateObject = {
    selectedPlatform: { id, name, index: platformIndex, role, status, hierarchicType, platformType },
    selectedProgramIndex: programIndex,
    selectedProgramId: selectedProgram.id || undefined,
    selectedProgramName: selectedProgram.name || '',
    selectedPlatformName: selectedPlatform.name
  };
  
  updateSelectedPlatform(updateObject);

  return { ...updateObject, programs };
};

/**
 * Forces the selection of a program given a programId
 */
export const handleSetForcedProgram = (
  platforms: IPlatform[],
  { programId, forcedPlatformId }: { programId?: number; forcedPlatformId?: number }
): ISelectionState | undefined => {
  if (!platforms.length) return;

  const { programIndex, platformIndex } = getForcedProgramIndexes(
    platforms,
    programId || 0,
    forcedPlatformId || 0
  );

  return handleSelectionUpdate(platforms, platformIndex, programIndex);
};

/**
 * Computes the current program index then sets the new cookie values and returns the set values
 */
export const handleSetActivePlatform = (platforms: IPlatform[], index: number): ISelectionState => {
  if (!platforms.length) {
    updateSelectedPlatform();
    return initialSelectionState;
  }

  if (index < 0 || index >= platforms.length) {
    return {};
  }

  const selectedPlatform = platforms[index];
  const sessionData = getSessionSelectedPlatform();
  const selectedProgramId = sessionData?.selectedProgramId;
  const selectedProgramIndex = getSelectedProgramIndex(
    selectedPlatform.programs,
    typeof selectedProgramId === 'number' ? selectedProgramId : 0
  );

  return handleSelectionUpdate(platforms, index, selectedProgramIndex);
};

/**
 * Returns whether platform is considered valid
 */
const isValidPlatform = (platform: IPlatform): boolean => {
  const isBeneficiaryBlocked =
    isUserBeneficiary(platform.role) &&
    ((platform.status && platform.status === PLATFORM_STATUS.EXPIRED) || platform.programs.length === 0);
  
  // In the platform slider we should NEVER show hyper or super platforms
  const isRegularOrSubPlatform =
    platform.hierarchicType === PLATFORM_HIERARCHIC_TYPE.INDEPENDENT ||
    platform.hierarchicType === PLATFORM_HIERARCHIC_TYPE.SUB_PLATFORM;
  
  return !isBeneficiaryBlocked && !!platform && !!platform.id && isRegularOrSubPlatform;
};

/**
 * Keeps only those programs to which user has access (according to platform role / program status)
 */
export const keepAccessibleProgramsOnly = (platform: IPlatform): IPlatform => {
  if (!hasAtLeastSuperRole(platform.role)) {
    platform.programs = platform.programs.filter(program => program.status === PROGRAM_DETAILS_JOINED);
  }
  return platform;
};

/**
 * Filters unwanted platforms and adds the default "all programs" when criteria is met
 */
export const mapValidPlatforms = (platforms: IPlatform[]): IPlatform[] => {
  return platforms
    .map(platform => keepAccessibleProgramsOnly(platform))
    .filter(platform => isValidPlatform(platform))
    .map(platform => {
      if (platform.programs.length > 1) {
        platform.programs.unshift({ name: DEFAULT_ALL_PROGRAMS });
      }
      return platform;
    });
};

/**
 * Check if platform can create programs
 */
export const canCreateProgramsOnPlatform = (platform: IPlatform): boolean =>
  !isSuperPlatform(platform.hierarchicType) && !isHyperPlatform(platform.hierarchicType);

/**
 * Extract platforms with sub-platforms flattened
 */
export const flattenPlatformsWithSubPlatforms = (platforms: IPlatform[]): IPlatform[] => {
  return platforms.reduce((acc: IPlatform[], platform) => {
    acc.push(platform);
    if (platform.subPlatforms && platform.subPlatforms.length) {
      return acc.concat(platform.subPlatforms);
    }
    return acc;
  }, []);
};
