// -----------------------------------------------------------------------------
// Wall Block Services
// Migrated from old_app/src/services/wall/blocks.ts
// -----------------------------------------------------------------------------

import { WALL_BLOCK, WallBlockType } from '@/constants/wall/blocks';
import { DEFAULT_WALL_ALL_PROGRAMS } from '@/constants/wall/programButtons';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface IBlocsData {
  bannerTitle: string;
  content: string;
  menuTitle: string;
  pictureUrl: string;
}

export interface UserRankingData {
  id: number;
  rank: number;
  nameId: string;
}

export interface BeneficiaryPointsProgram {
  id: number;
  platformId: number;
  points: number;
  totalPoints: number;
  name?: string;
  converted?: boolean;
  canConvert?: boolean;
}

export interface PlatformTotalPoints {
  id: number;
  points: number;
}

// -----------------------------------------------------------------------------
// User Rankings
// -----------------------------------------------------------------------------

/**
 * Maps the given platforms to the required format for storing data in store
 */
export const mapUserRankings = (
  allRankings: any[],
  programId: number | undefined,
  platformId: number
) => {
  const currentPlatform = allRankings.find(({ id }) => id === platformId) || {} as any;
  let selectedRanking: UserRankingData = {
    id: currentPlatform.id,
    rank: currentPlatform.averageRank,
    nameId: DEFAULT_WALL_ALL_PROGRAMS
  };
  
  if (programId) {
    selectedRanking = (currentPlatform.programs || []).find(({ id }: any) => id === programId) || {} as UserRankingData;
  }

  return {
    selectedRanking,
    allRankings,
    programRankings: currentPlatform.programs || []
  };
};

// -----------------------------------------------------------------------------
// Beneficiary Points
// -----------------------------------------------------------------------------

/**
 * Maps the given platforms to the required format for storing data in store
 */
export const mapBeneficiaryPointsPrograms = (platforms: any[]) => ({
  selectedBeneficiaryPoints: {},
  totalPlatformsPoints: platforms.map(platform => ({
    points: platform.points,
    id: platform.id
  })),
  platformProgramsPointsList: platforms.flatMap(platform =>
    platform.programs.map((program: any) => ({
      ...program,
      platformId: platform.id,
      totalPoints: platform.points
    }))
  )
});

/**
 * Maps the given platforms to the required format for storing data in store
 */
export const mapSelectedBeneficiaryPoints = (
  selectedPlatformId: number,
  programId: number | undefined,
  platformProgramsPointsList: BeneficiaryPointsProgram[],
  totalPoints: PlatformTotalPoints[]
) => {
  if (!programId) {
    const selectedBeneficiaryPlatformData =
      platformProgramsPointsList.find(({ platformId }) => selectedPlatformId === platformId) || {} as BeneficiaryPointsProgram;
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
 */
export const getPlatformTotalPoints = (
  totalPoints: PlatformTotalPoints[] | undefined,
  id: number,
  selectedBeneficiaryPoints: { points?: number }
): number => {
  if (selectedBeneficiaryPoints?.points) {
    return selectedBeneficiaryPoints.points;
  }
  return 0;
};

/**
 * Returns the current program points
 */
export const getCurrentProgramPoints = (
  adminPointsData: { totalPoints: number; platforms?: { programs: any[] } },
  selectedProgramId: number
): number => {
  const currentPoints = adminPointsData.platforms?.programs?.find(
    (program: any) => program.id === selectedProgramId
  );
  return currentPoints?.points || 0;
};

// -----------------------------------------------------------------------------
// Program Details
// -----------------------------------------------------------------------------

const DEFAULT_BLOC_DETAILS: IBlocsData = {
  bannerTitle: WALL_BLOCK.USER_BLOCK,
  content: '{"blocks":[{"key":"2b0ps","text":"Test text description ...","type":"unstyled","inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}',
  menuTitle: 'Test Title',
  pictureUrl: 'https://s3.eu-central-1.amazonaws.com/cr-prod-posts-files-images-eu/lp_hero_advent_calendar_grd_1634666213616f06e548c1e.jpg'
};

/**
 * Returns the current program details for a specific block
 */
export const getCurrentProgramDetails = (
  programDetails: { pages?: any[] } | null | undefined,
  blocId: WallBlockType
): IBlocsData => {
  const retValue: Record<WallBlockType, IBlocsData> = {
    [WALL_BLOCK.USER_BLOCK]: DEFAULT_BLOC_DETAILS,
    [WALL_BLOCK.POINTS_BLOCK]: DEFAULT_BLOC_DETAILS,
    [WALL_BLOCK.DECLARATIONS_BLOCK]: DEFAULT_BLOC_DETAILS,
    [WALL_BLOCK.PAYMENT_BLOCK]: DEFAULT_BLOC_DETAILS,
    [WALL_BLOCK.SETTINGS_BLOCK]: DEFAULT_BLOC_DETAILS,
    [WALL_BLOCK.IMAGES_IDS]: DEFAULT_BLOC_DETAILS
  };

  const pagesArray = programDetails?.pages || [];

  pagesArray.forEach((value: any) => {
    switch (value['bannerTitle']) {
      case null:
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
