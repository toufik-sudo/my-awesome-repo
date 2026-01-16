import UserApi from 'api/UsersApi';
import { forceActiveProgram, setLoadingPlatforms, setPlatforms, setSuperPlatforms } from 'store/actions/wallActions';
import { getSessionSelectedPlatform, getUserUuid, updateSelectedPlatform } from 'services/UserDataServices';
import { DEFAULT_ALL_PROGRAMS } from 'constants/wall/programButtons';
import { PLATFORM_STATUS } from 'constants/general';
import { PLATFORM_HIERARCHIC_TYPE } from 'constants/platforms';
import { IPlatform, IProgram } from 'interfaces/components/wall/IWallPrograms';
import { initialSelectionState } from 'store/initialState/initialWallState';
import { PROGRAM_DETAILS_JOINED, DEFAULT_ADMIN_PLATFORMS_QUERY } from 'constants/api/userPrograms';
import { isUserBeneficiary, hasAtLeastSuperRole } from 'services/security/accessServices';
import { isSuperPlatform, isHyperPlatform } from 'services/HyperProgramService';

const userApi = new UserApi();

/**
 * Returns platformIndex and programIndex that contains the programId
 *
 * @param platforms
 * @param selectedProgramId
 * @param forcedPlatformId
 */
export const getForcedProgramIndexes = (
  platforms: IPlatform[],
  selectedProgramId: number,
  forcedPlatformId: number
) => {
  let programIndex = 0;
  const platformIndex = platforms.findIndex(({ programs, id }) => {
    if (forcedPlatformId && Number(forcedPlatformId) !== Number(id)) {
      return false;
    }

    programIndex = programs.findIndex(({ id }) => !selectedProgramId || Number(id) === Number(selectedProgramId));
    return programIndex >= 0 || forcedPlatformId;
  });

  return {
    programIndex: Math.max(programIndex, 0),
    platformIndex: Math.max(platformIndex, 0)
  };
};

/**
 * Returns the selected programIndex or default to 0
 * @param programs
 * @param selectedProgramId
 */
const getSelectedProgramIndex = (programs: IProgram[], selectedProgramId: number) => {
  return Math.max(
    programs.findIndex(({ id }) => Number(id) === Number(selectedProgramId)),
    0
  );
};

/**
 * Computes the current program index then sets the new cookie values and returns the set values
 * @param programs
 * @param nextProgramId
 */
export const handleSetActiveProgram = (programs: IProgram[], nextProgramId) => {
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
 * Forces the selection of a program given a programId
 * If forcedPlatformId is provided the programId will be searched on that particular platformId
 *
 * If nothing matches defaults to first platform and program
 *
 * @param platforms
 * @param selectedProgramId
 */
export const handleSetForcedProgram = (platforms: IPlatform[], { programId, forcedPlatformId }) => {
  if (!platforms.length) return;

  const { programIndex, platformIndex } = getForcedProgramIndexes(platforms, programId, forcedPlatformId);

  return handleSelectionUpdate(platforms, platformIndex, programIndex);
};

/**
 * Computes the current program index then sets the new cookie values and returns the set values
 *
 * @param platforms
 * @param index
 */
export const handleSetActivePlatform = (platforms: IPlatform[], index) => {
  if (!platforms.length) {
    updateSelectedPlatform();

    return initialSelectionState;
  }

  if (index < 0 || index >= platforms.length) {
    return {};
  }

  const selectedPlatform = platforms[index];
  const selectedProgramIndex = getSelectedProgramIndex(
    selectedPlatform.programs,
    getSessionSelectedPlatform().selectedProgramId
  );

  return handleSelectionUpdate(platforms, index, selectedProgramIndex);
};

/**
 * Computes platform/program selection state.
 * @param platforms
 * @param platformIndex
 * @param programIndex
 */
const handleSelectionUpdate = (platforms: IPlatform[], platformIndex, programIndex) => {
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
 * Returns whether platform is considered valid:
 * - has id
 * - has at least one program
 * @param platform
 */
const isValidPlatform = platform => {
  const isBeneficiaryBlocked =
    isUserBeneficiary(platform.role) &&
    ((platform.status && platform.status === PLATFORM_STATUS.EXPIRED) || platform.programs.length === 0);
  // in the platform slider we should NEVER show hyper or super platforms
  const isRegularOrSubPlatform =
    platform.hierarchicType == PLATFORM_HIERARCHIC_TYPE.INDEPENDENT ||
    platform.hierarchicType == PLATFORM_HIERARCHIC_TYPE.SUB_PLATFORM;
  return !isBeneficiaryBlocked && platform && platform.id && isRegularOrSubPlatform;
};

/**
 * Keeps only those programs to which user has access (according to his platform role / program status).
 *
 * @param platform
 */
export const keepAccessibleProgramsOnly = platform => {
  if (!hasAtLeastSuperRole(platform.role)) {
    platform.programs = platform.programs.filter(program => program.status === PROGRAM_DETAILS_JOINED);
  }

  return platform;
};

/**
 * Filters unwanted platforms and adds the default "all programs" when criteria is met
 *
 * @param platforms
 */
const mapValidPlatforms = platforms => {
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
 *  Method used to call get all programs grouped by platforms
 * @param dispatch
 * @param programId
 * @param platformId
 * @param loginProgramId
 * @param isSuperUser
 */
export const retrievePlatformsData: (dispatch, routeForcedIds, loginProgramId?, isSuperUser?) => void = async (
  dispatch,
  { programId, platformId },
  loginProgramId = undefined,
  isSuperUser = false
) => {
  try {
    dispatch(setLoadingPlatforms(true));
    const platforms = await retrievePlatforms(isSuperUser);
    const validPlatforms = mapValidPlatforms(platforms);
    const superPlatforms = platforms.filter(platform => !validPlatforms.includes(platform) && platform);
    dispatch(setPlatforms(validPlatforms));
    dispatch(setSuperPlatforms(superPlatforms));

    const { selectedPlatform } = getSessionSelectedPlatform();
    const cookieSelectedPlatform = selectedPlatform && selectedPlatform.id;
    const activeProgramPayload = {
      unlockSelection: true,
      programId: loginProgramId || programId,
      forcedPlatformId: !loginProgramId ? platformId || cookieSelectedPlatform : undefined
    };
    await dispatch(forceActiveProgram(activeProgramPayload));
  } catch (e) {
    //do nothing
  }
  dispatch(setLoadingPlatforms(false));
};

/**
 * @implNote large number of platforms might be returned (especially for super users)
 * @param isSuperUser
 */
const retrievePlatforms = async isSuperUser => {
  const userUuid = getUserUuid();
  if (isSuperUser) {
    const { entries } = await userApi.getAdminPrograms(userUuid, {
      platformsSize: DEFAULT_ADMIN_PLATFORMS_QUERY.platformsSize
    });

    return entries.reduce((acc, platform) => {
      acc.push(platform);
      if (platform.subPlatforms && platform.subPlatforms.length) {
        return acc.concat(platform.subPlatforms);
      }
      return acc;
    }, []);
  }

  const {
    data: { platforms }
  } = await userApi.getProgramsGroupedByPlatform(userUuid);

  return platforms;
};

/**
 *  Method used to call get all programs grouped by platforms
 *
 * @param platformId
 */
export const retrieveProgramsForPlatform: (platformId) => Promise<any> = async platformId => {
  let selectedPlatform: any = {};
  try {
    const {
      data: { platforms }
    } = await userApi.getProgramsGroupedByPlatform(getUserUuid());

    const index = platforms.findIndex(platform => platform.id === platformId);
    const selectedPlatformIndex = Math.max(0, index);
    selectedPlatform = { ...platforms[selectedPlatformIndex], index: selectedPlatformIndex };

    return Promise.resolve({ platforms, selectedPlatform });
  } catch (e) {
    return Promise.resolve({ platforms: [], selectedPlatform: { programs: [] } });
  }
};

export const canCreateProgramsOnPlatform = platform =>
  !isSuperPlatform(platform.hierarchicType) && !isHyperPlatform(platform.hierarchicType);
