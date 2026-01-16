/* eslint-disable quotes */
import { OBJECT } from 'constants/validation';
import { WALL_BLOCK } from 'constants/wall/blocks';
import { DEFAULT_WALL_ALL_PROGRAMS } from 'constants/wall/programButtons';
import { IBlocsData } from 'interfaces/components/wall/IWallPrograms';

/**
 * Maps the given platforms to the required format for storing data in store
 * @param allRankings
 * @param programId
 * @param platformId
 */
export const mapUserRankings = (allRankings, programId, platformId) => {
  const currentPlatform = allRankings.find(({ id }) => id === platformId) || ({} as any);
  let selectedRanking = {
    id: currentPlatform.id,
    rank: currentPlatform.averageRank,
    nameId: DEFAULT_WALL_ALL_PROGRAMS
  };
  if (programId) {
    selectedRanking = (currentPlatform.programs || []).find(({ id }) => id === programId) || {};
  }

  return {
    selectedRanking,
    allRankings,
    programRankings: currentPlatform.programs || []
  };
};

/**
 * Maps the given platforms to the required format for storing data in store
 * @param platforms
 */
export const mapBeneficiaryPointsPrograms = platforms => ({
  selectedBeneficiaryPoints: {},
  totalPlatformsPoints: platforms.map(platform => {
    return { points: platform.points, id: platform.id };
  }),
  platformProgramsPointsList: platforms.flatMap(platform =>
    platform.programs.map(program => {
      program.platformId = platform.id;
      program.totalPoints = platform.points;
      return program;
    })
  )
});

/**
 * Maps the given platforms to the required format for storing data in store
 * @param selectedPlatformId
 * @param programId
 * @param platformProgramsPointsList
 * @param totalPoints
 */
export const mapSelectedBeneficiaryPoints = (
  selectedPlatformId,
  programId,
  platformProgramsPointsList,
  totalPoints
) => {
  if (!programId) {
    const selectedBeneficiaryPlatformData =
      platformProgramsPointsList.find(({ platformId }) => selectedPlatformId === platformId) || {};
    return {
      platformProgramsPointsList,
      totalPoints,
      selectedBeneficiaryPoints: {
        id: selectedPlatformId,
        points: selectedBeneficiaryPlatformData.totalPoints
      }
    };
  }

  return {
    platformProgramsPointsList,
    totalPoints,
    selectedBeneficiaryPoints:
      platformProgramsPointsList.find(({ platformId, id }) => selectedPlatformId === platformId && id === programId) ||
      {}
  };
};

/**
 * Returns the number of points for selected platform
 * @param totalPoints
 * @param id
 * @param selectedBeneficiaryPoints
 */
export const getPlatformTotalPoints = (totalPoints, id, selectedBeneficiaryPoints) => {
  if (selectedBeneficiaryPoints.points) {
    return selectedBeneficiaryPoints.points;
  }

  return 0;
};

/**
 * Returns the current program points
 *
 * @param adminPointsData
 * @param selectedProgramId
 */
export const getCurrentProgramPoints = (adminPointsData, selectedProgramId) => {
  const currentPoints = adminPointsData.platforms.programs.find(program => program.id === selectedProgramId);
  if (currentPoints) {
    return currentPoints.points;
  }

  return 0;
};

/**
 * Returns the current program points
 *
 * @param programDetails
 */
export const getCurrentProgramDetails = (programDetails, blocId): IBlocsData => {
  const testBlocsDetails: IBlocsData = {
    bannerTitle: WALL_BLOCK.USER_BLOCK,
    content:
      '{"blocks":[{"key":"2b0ps","text":"Test text description ...","type":"unstyled","inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}',
    menuTitle: 'Test Title',
    pictureUrl:
      'https://s3.eu-central-1.amazonaws.com/cr-prod-posts-files-images-eu/lp_hero_advent_calendar_grd_1634666213616f06e548c1e.jpg'
  };
  let retValue = {
    [WALL_BLOCK.USER_BLOCK]: testBlocsDetails,
    [WALL_BLOCK.POINTS_BLOCK]: testBlocsDetails,
    [WALL_BLOCK.DECLARATIONS_BLOCK]: testBlocsDetails,
    [WALL_BLOCK.PAYMENT_BLOCK]: testBlocsDetails,
    [WALL_BLOCK.SETTINGS_BLOCK]: testBlocsDetails
  };
  const pagesArray = programDetails && programDetails.pages ? programDetails.pages : [];

  pagesArray.forEach((value, index) => {
    switch (value['bannerTitle']) {
      case null:
        retValue[WALL_BLOCK.USER_BLOCK] = value;
        break;
      case WALL_BLOCK.USER_BLOCK:
        retValue[WALL_BLOCK.USER_BLOCK] = value;
        break;
      case WALL_BLOCK.POINTS_BLOCK:
        retValue[WALL_BLOCK.POINTS_BLOCK] = value;
        break;
      case WALL_BLOCK.DECLARATIONS_BLOCK:
        retValue[WALL_BLOCK.DECLARATIONS_BLOCK] = value;
        break;
      case WALL_BLOCK.PAYMENT_BLOCK:
        retValue[WALL_BLOCK.PAYMENT_BLOCK] = value;
        break;
      case WALL_BLOCK.SETTINGS_BLOCK:
        retValue[WALL_BLOCK.SETTINGS_BLOCK] = value;
        break;

      default:
        break;
    }
  });
  return retValue[blocId];
};
