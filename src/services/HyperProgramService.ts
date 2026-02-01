// -----------------------------------------------------------------------------
// Hyper Program Service
// Migrated from old_app/src/services/HyperProgramService.ts
// Service for handling hyper/super platform logic
// -----------------------------------------------------------------------------

import { PLATFORM_HIERARCHIC_TYPE } from '@/constants/platforms';
import { IPlatform } from '@/features/wall/types';

// Platform name length constraints
const PLATFORM_IDENTIFIER_LENGTH = {
  MIN: 3,
  MAX: 100
};

/**
 * Normalize hierarchic type to number
 */
const normalizeHierarchicType = (hierarchicType: number | string | undefined): number => {
  if (typeof hierarchicType === 'string') {
    const parsed = parseInt(hierarchicType, 10);
    return isNaN(parsed) ? 0 : parsed;
  }
  return hierarchicType || 0;
};

/**
 * Method used to get unique roles from program arrays
 * Maps through all platforms and returns a unique array of user roles
 */
export const getRolesArrayFromPrograms = (userPlatforms: IPlatform[]): number[] => {
  const arrayRoles = userPlatforms.map(platform => platform.role);
  const uniqueArrayRoles: number[] = Array.from(new Set(arrayRoles));
  return uniqueArrayRoles;
};

/**
 * Validate platform name length
 */
export const isValidPlatformName = (name: string = ''): boolean => {
  const nameLength = name.trim().length;
  return nameLength >= PLATFORM_IDENTIFIER_LENGTH.MIN && nameLength < PLATFORM_IDENTIFIER_LENGTH.MAX;
};

/**
 * Check if platform is a super platform
 * @param hierarchicType - Platform hierarchic type
 */
export const isSuperPlatform = (hierarchicType: number | string | undefined): boolean => {
  return normalizeHierarchicType(hierarchicType) === PLATFORM_HIERARCHIC_TYPE.SUPER_PLATFORM;
};

/**
 * Check if platform is a hyper platform
 * @param hierarchicType - Platform hierarchic type
 */
export const isHyperPlatform = (hierarchicType: number | string | undefined): boolean => {
  return normalizeHierarchicType(hierarchicType) === PLATFORM_HIERARCHIC_TYPE.HYPER_PLATFORM;
};

/**
 * Check if platform is independent
 * @param hierarchicType - Platform hierarchic type
 */
export const isIndependentPlatform = (hierarchicType: number | string | undefined): boolean => {
  return normalizeHierarchicType(hierarchicType) === PLATFORM_HIERARCHIC_TYPE.INDEPENDENT;
};

/**
 * Check if platform is a sub-platform
 * @param hierarchicType - Platform hierarchic type
 */
export const isSubPlatform = (hierarchicType: number | string | undefined): boolean => {
  return normalizeHierarchicType(hierarchicType) === PLATFORM_HIERARCHIC_TYPE.SUB_PLATFORM;
};

/**
 * Check if platform can create programs (not super or hyper)
 * @param hierarchicType - Platform hierarchic type
 */
export const canCreatePrograms = (hierarchicType: number | string | undefined): boolean => {
  return !isSuperPlatform(hierarchicType) && !isHyperPlatform(hierarchicType);
};

/**
 * Find a platform by ID in a list of platforms
 */
export const findPlatformById = (platforms: IPlatform[], platformId: number): IPlatform | undefined => {
  return platforms.find(({ id }) => id === platformId);
};

/**
 * Get all sub-platforms from a super platform
 */
export const getSubPlatformsFromSuper = (superPlatform: IPlatform): IPlatform[] => {
  return superPlatform.subPlatforms || [];
};

/**
 * Check if platform can have programs created under it
 * Only SUB_PLATFORM and INDEPENDENT can have programs
 */
export const canCreateProgramUnder = (platform: IPlatform): boolean => {
  const { hierarchicType } = platform;
  return (
    hierarchicType === PLATFORM_HIERARCHIC_TYPE.SUB_PLATFORM ||
    hierarchicType === PLATFORM_HIERARCHIC_TYPE.INDEPENDENT ||
    !hierarchicType
  );
};

/**
 * Check if platform can have sub-platforms created under it
 * Only SUPER_PLATFORM can have sub-platforms
 */
export const canCreateSubPlatform = (platform: IPlatform): boolean => {
  return isSuperPlatform(platform.hierarchicType);
};

/**
 * Get the display label for a platform type
 */
export const getPlatformTypeLabel = (hierarchicType?: PLATFORM_HIERARCHIC_TYPE | number): string => {
  switch (hierarchicType) {
    case PLATFORM_HIERARCHIC_TYPE.SUPER_PLATFORM:
      return 'Super Platform';
    case PLATFORM_HIERARCHIC_TYPE.SUB_PLATFORM:
      return 'Sub-Platform';
    case PLATFORM_HIERARCHIC_TYPE.HYPER_PLATFORM:
      return 'Hyper Platform';
    case PLATFORM_HIERARCHIC_TYPE.INDEPENDENT:
    default:
      return 'Platform';
  }
};
