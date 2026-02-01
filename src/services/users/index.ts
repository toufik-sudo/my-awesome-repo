// -----------------------------------------------------------------------------
// Users Services Barrel Export
// -----------------------------------------------------------------------------

export {
  // Constants
  PROGRAM_STATUS,
  USER_PROGRAM_STATUS,
  USER_ROLE,
  JOIN_OPERATION,
  // Types
  type UserProgram,
  type UserDetails,
  type FieldConfig,
  type ProcessedProgram,
  type GroupedPrograms,
  // Functions
  filterUserMessages,
  isProgramOngoing,
  isProgramFinished,
  isProgramInvitationPending,
  isProgramJoinPending,
  hasUserJoinedProgram,
  isNotActiveOnProgram,
  canChangeUserProgramRole,
  getUserProgramFields,
  prepareUserDetailsToDisplay,
  groupUserProgramsByStatus,
  updateProgramsOnJoinValidated,
} from './UsersServices';
