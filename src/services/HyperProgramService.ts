import { PLATFORM_IDENTIFIER_LENGTH } from 'constants/validation';
import { PLATFORM_HIERARCHIC_TYPE } from 'constants/platforms';
import { IPlatform } from 'interfaces/components/wall/IWallPrograms';

/**
 * Method used to get unique roles from program arrays
 *
 * @implNote map through all platforms and returns a unique array of user roles
 * Will be used to decide what role does the user have
 *
 * @param userPlatforms
 */
export const getRolesArrayFromPrograms = userPlatforms => {
  const arrayRoles = userPlatforms.map(platform => platform.role);
  // @ts-ignore
  const uniqueArrayRoles: number[] = Array.from([...new Set(arrayRoles)]);

  return uniqueArrayRoles;
};

export const isValidPlatformName = (name = '') => {
  const nameLength = name.trim().length;

  return nameLength >= PLATFORM_IDENTIFIER_LENGTH.MIN && nameLength < PLATFORM_IDENTIFIER_LENGTH.MAX;
};

/**
 * Checks whether given hierarchicType corresponds to a super-platform
 * @param hierarchicType
 */
export const isSuperPlatform = (hierarchicType: PLATFORM_HIERARCHIC_TYPE | number) =>
  hierarchicType === PLATFORM_HIERARCHIC_TYPE.SUPER_PLATFORM;

/**
 * Checks whether given hierarchicType corresponds to a hyper-platform
 * @param hierarchicType
 */
export const isHyperPlatform = (hierarchicType: PLATFORM_HIERARCHIC_TYPE | number) =>
  hierarchicType === PLATFORM_HIERARCHIC_TYPE.HYPER_PLATFORM;

/**
 * Checks whether given hierarchicType corresponds to an independent platform
 * @param hierarchicType
 */
export const isIndependentPlatform = (hierarchicType: PLATFORM_HIERARCHIC_TYPE | number) =>
  !hierarchicType || hierarchicType === PLATFORM_HIERARCHIC_TYPE.INDEPENDENT;

export const findPlatformById = (platforms: IPlatform[], platformId: number) =>
  platforms.find(({ id }) => id === platformId) || {};
