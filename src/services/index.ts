// -----------------------------------------------------------------------------
// Services Barrel Export
// -----------------------------------------------------------------------------

export * from './UserDataServices';
export * from './AccountServices';
export * from './FormServices';
export * from './PlatformSelectionServices';
export * from './HyperProgramService';
export * from './security/accessServices';
export * from './notifications';
export * from './payments';
export * from './declarations';
export * from './users';
export * from './onboarding';
export * from './pointConversions';

// Programs - explicitly re-export to avoid conflicts with PlatformSelectionServices
export {
  // Types (using Program prefix to avoid conflict)
  type IPreparedProgram,
  type JoinRequestState,
  // Status helpers
  isProgramOngoing,
  isProgramFinished,
  isProgramInvitationPending,
  // Lookup functions
  findProgramById,
  findProgramByPlatformAndId,
  // Filtering & preparation
  prepareProgramsList,
  filterProgramsByType,
  findProgramsByStatus,
  findProgramsByRoleAndStatus,
  getOngoingProgramsWhereUserIsAdmin,
  getAllProgramsWhereUserIsBeneficiary,
  // Join request management
  addJoinValidationInProgress,
  removeJoinValidation,
  isJoinRequestValidationInProgress,
} from './programs';

// Cube Services (Launch Wizard)
export * from './cube';

// Wall Services
export * from './wall/blocks';
export * from './wall/settings';
export * from './wall/agenda';

// Utility Services
export * from './ConverterService';
export * from './FileServices';
export * from './AnalyticsServices';
export * from './PriceServices';
