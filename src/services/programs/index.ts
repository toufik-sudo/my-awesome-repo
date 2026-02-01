// -----------------------------------------------------------------------------
// Program Services Barrel Export
// -----------------------------------------------------------------------------

export {
  // Types
  type IProgram,
  type IPlatform,
  type IPreparedProgram,
  type JoinRequestState,
  // Status helpers
  isProgramOngoing,
  isProgramFinished,
  isProgramInvitationPending,
  // Role helpers
  isUserBeneficiary,
  isAnyKindOfAdmin,
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
} from './ProgramServices';
