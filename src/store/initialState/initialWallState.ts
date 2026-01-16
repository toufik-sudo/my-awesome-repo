import { getValidPlatformData } from 'services/UserDataServices';

export const initialSelectionState = {
  programs: [],
  platforms: [],
  selectedProgramId: undefined,
  selectedProgramIndex: null,
  isProgramSelectionLocked: false,
  selectedProgramName: '',
  selectedProgramDetail: {},
  selectedPlatform: { index: null, name: '', id: undefined, role: undefined, status: null, hierarchicType: undefined }
};

export const initialWallState = {
  ...initialSelectionState,
  loadingPlatforms: true,
  redirectData: {},
  programUsers: { data: [], total: 0 },
  userRankings: { selectedRanking: {}, allRankings: [], programRankings: [] },
  agenda: { reload: false },
  ...getValidPlatformData(),
  linkedEmailsData: [],
  platformProgramsPointsList: [],
  beneficiaryPoints: {
    selectedBeneficiaryPoints: {},
    platformProgramsPointsList: [],
    totalPlatformsPoints: null,
    reloadKey: 0
  },
  programDetails: {}
};
