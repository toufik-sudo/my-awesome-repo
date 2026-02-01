// -----------------------------------------------------------------------------
// Users Services
// Migrated from old_app/src/services/UsersServices.ts
// -----------------------------------------------------------------------------

import { format } from 'date-fns';

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

export const PROGRAM_STATUS = {
  ONGOING: 'ONGOING',
  FINISHED: 'FINISHED',
  CLOSING: 'CLOSING',
} as const;

export const USER_PROGRAM_STATUS = {
  JOINED: 'JOINED',
  BLOCKED: 'BLOCKED',
  INVITED: 'INVITED',
  PENDING: 'PENDING',
  ACTIVE: 'ACTIVE',
} as const;

export const USER_ROLE = {
  MANAGER: 'MANAGER',
  USER: 'USER',
} as const;

export const JOIN_OPERATION = {
  ACCEPT: 'ACCEPT',
  REJECT: 'REJECT',
} as const;

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface UserProgram {
  id: number;
  name?: string;
  status?: string;
  programStatus?: string;
  isPeopleManager?: boolean;
  joinedAt?: string;
  requestToJoinAt?: string;
  endDate?: string;
  [key: string]: unknown;
}

export interface UserDetails {
  fields?: string[];
  socialMediaAccounts?: Record<string, string>;
  [key: string]: unknown;
}

export interface FieldConfig {
  label: string;
  type?: string;
  [key: string]: unknown;
}

export interface ProcessedProgram extends UserProgram {
  date?: string;
  role?: string;
}

export interface GroupedPrograms {
  ongoing: ProcessedProgram[];
  finished: ProcessedProgram[];
  pending: ProcessedProgram[];
}

// -----------------------------------------------------------------------------
// Translation Processing
// -----------------------------------------------------------------------------

/**
 * Filters i18n messages by prefix, excluding specified endings
 * 
 * @param messages - Object containing all i18n messages
 * @param prefix - Key prefix to filter by
 * @param excludeEnd - Ending to exclude
 * @param excludeWord - Additional word to exclude
 * @returns Array of matching message keys
 */
export const filterUserMessages = (
  messages: Record<string, string>,
  prefix: string,
  excludeEnd: string,
  excludeWord: string
): string[] => {
  return Object.keys(messages).filter(
    (key) =>
      key.startsWith(prefix) && !key.endsWith(excludeEnd) && !key.endsWith(excludeWord)
  );
};

// -----------------------------------------------------------------------------
// Program Status Helpers
// -----------------------------------------------------------------------------

/**
 * Checks if program is ongoing (active or closing)
 */
export const isProgramOngoing = (program: UserProgram): boolean => {
  return (
    program.programStatus === PROGRAM_STATUS.ONGOING ||
    program.programStatus === PROGRAM_STATUS.CLOSING
  );
};

/**
 * Checks if program has finished
 */
export const isProgramFinished = (program: UserProgram): boolean => {
  return program.programStatus === PROGRAM_STATUS.FINISHED;
};

/**
 * Checks if user has a pending invitation for the program
 */
export const isProgramInvitationPending = (program: UserProgram): boolean => {
  return (
    program.status === USER_PROGRAM_STATUS.INVITED && isProgramOngoing(program)
  );
};

/**
 * Checks if user is waiting for admin approval to join
 */
export const isProgramJoinPending = (program: UserProgram): boolean => {
  return (
    program.status === USER_PROGRAM_STATUS.PENDING && isProgramOngoing(program)
  );
};

/**
 * Checks if user has joined the program
 */
export const hasUserJoinedProgram = (status?: string): boolean => {
  return (
    status === USER_PROGRAM_STATUS.JOINED ||
    status === USER_PROGRAM_STATUS.BLOCKED
  );
};

/**
 * Checks if user is not active on program
 */
export const isNotActiveOnProgram = (program: UserProgram): boolean => {
  return (
    program.status !== USER_PROGRAM_STATUS.JOINED || isProgramFinished(program)
  );
};

/**
 * Checks if user's role can be changed in the program
 */
export const canChangeUserProgramRole = (program: UserProgram): boolean => {
  return (
    isProgramOngoing(program) && program.status === USER_PROGRAM_STATUS.ACTIVE
  );
};

// -----------------------------------------------------------------------------
// User Details Processing
// -----------------------------------------------------------------------------

const SOCIAL_NETWORKS = [
  'facebook',
  'twitter',
  'linkedin',
  'instagram',
  'youtube',
];
const FIELDS_TO_SKIP = ['title', 'firstName', 'lastName'];

/**
 * Gets user program fields based on registration configuration
 * 
 * @param registerFields - Array of field names to include
 * @param fieldsToSkip - Fields to exclude
 * @param fieldConfigs - Available field configurations
 * @returns Filtered field configurations
 */
export const getUserProgramFields = (
  registerFields: string[],
  fieldsToSkip: string[] = FIELDS_TO_SKIP,
  fieldConfigs: FieldConfig[] = []
): FieldConfig[] => {
  return fieldConfigs.filter((field) => {
    if (fieldsToSkip.includes(field.label)) {
      return false;
    }
    return registerFields?.includes(field.label);
  });
};

/**
 * Prepares user details for display
 * 
 * @param userDetails - Raw user details object
 * @param fieldConfigs - Available field configurations
 * @returns Array of fields with values
 */
export const prepareUserDetailsToDisplay = (
  userDetails: UserDetails,
  fieldConfigs: FieldConfig[] = []
): Array<FieldConfig & { value: unknown }> => {
  const { fields } = userDetails;

  if (!fields?.length) {
    return [];
  }

  const programFields = getUserProgramFields(fields, FIELDS_TO_SKIP, fieldConfigs);

  return programFields.map((field) => {
    const { label } = field;
    let value = userDetails[label];

    // Handle social network accounts separately
    if (SOCIAL_NETWORKS.includes(label) && userDetails.socialMediaAccounts) {
      value = userDetails.socialMediaAccounts[label];
    }

    return {
      ...field,
      value,
    };
  });
};

// -----------------------------------------------------------------------------
// Program Grouping
// -----------------------------------------------------------------------------

/**
 * Resolves the category key for a program
 */
const resolveProgramCategoryKey = (
  program: UserProgram
): 'pending' | 'ongoing' | 'finished' => {
  if (isProgramJoinPending(program)) {
    return 'pending';
  }
  if (isProgramOngoing(program)) {
    return 'ongoing';
  }
  return 'finished';
};

/**
 * Groups user programs by their status
 * 
 * @param programs - Array of user programs
 * @returns Grouped programs by status
 */
export const groupUserProgramsByStatus = (
  programs: UserProgram[]
): GroupedPrograms => {
  const grouped: GroupedPrograms = {
    ongoing: [],
    finished: [],
    pending: [],
  };

  programs.forEach((program) => {
    const category = resolveProgramCategoryKey(program);
    
    if (!hasUserJoinedProgram(program.status) && category === 'finished') {
      return; // Skip finished programs user hasn't joined
    }

    const date =
      category === 'pending' ? program.requestToJoinAt : program.joinedAt;

    const processedProgram: ProcessedProgram = {
      ...program,
      date: date ? format(new Date(date), 'yyyy-MM-dd') : undefined,
      role: program.isPeopleManager ? USER_ROLE.MANAGER : USER_ROLE.USER,
    };

    grouped[category].push(processedProgram);
  });

  return grouped;
};

// -----------------------------------------------------------------------------
// Join Request Handling
// -----------------------------------------------------------------------------

/**
 * Updates programs after join request validation
 * 
 * @param programsByStatus - Current grouped programs
 * @param programId - ID of the program
 * @param operation - Accept or reject operation
 * @returns Updated grouped programs
 */
export const updateProgramsOnJoinValidated = (
  programsByStatus: GroupedPrograms,
  programId: number,
  operation: keyof typeof JOIN_OPERATION
): GroupedPrograms => {
  const pending = programsByStatus.pending || [];
  const program = pending.find((p) => p.id === programId);

  if (!program) {
    return programsByStatus;
  }

  const updatedPending = pending.filter((p) => p.id !== programId);

  // If rejected, just remove from pending
  if (operation === 'REJECT') {
    return {
      ...programsByStatus,
      pending: updatedPending,
    };
  }

  // If accepted, add to ongoing with active status
  const activeProgram: ProcessedProgram = {
    ...program,
    status: USER_PROGRAM_STATUS.ACTIVE,
  };

  return {
    ...programsByStatus,
    pending: updatedPending,
    ongoing: [activeProgram, ...programsByStatus.ongoing],
  };
};
