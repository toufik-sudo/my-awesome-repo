import { IReactIntl } from 'interfaces/IGeneral';
import MomentUtilities from 'utils/MomentUtilities';
import {
  PROGRAM_ONGOING,
  USER_STATUS_MANAGER,
  USER_PROGRAM_STATUSES,
  USER_STATUS_USER,
  PROGRAM_FINISHED,
  PROGRAM_JOIN_PENDING,
  PROGRAM_JOIN_OPERATION,
  PROGRAM_DETAILS_STATUS_ACTIVE,
  PROGRAM_CLOSING,
  PROGRAM_DETAILS_JOINED,
  PROGRAM_DETAILS_BLOCKED,
  PROGRAM_DETAILS_INVITED
} from 'constants/api/userPrograms';
import { SOCIAL_NETWORKS, FORM_FIELDS, REGISTER_FORM_FIELDS_CUSTOM_MAPPING } from 'constants/forms';
import { PROGRAM_JOIN_USER_FIELDS } from 'constants/formDefinitions/formDeclarations';

/**
 * Method filters messages based on a start/end
 *
 * @param messages
 * @param start
 * @param end
 * @param extraWord
 */
export const processTranslations = (messages: IReactIntl, start: string, end: string, extraWord: string) => {
  return Object.keys(messages).filter(key => key.startsWith(start) && !key.endsWith(end) && !key.endsWith(extraWord));
};

/**
 * Prepares the information which needs to be displayed for user details
 * @param userDetails
 */
export const prepareUserDetailsToDisplay = userDetails => {
  const { fields } = userDetails;
  if (!(fields && fields.length)) {
    return [];
  }

  const fieldsToSkip = [FORM_FIELDS.TITLE, FORM_FIELDS.FIRST_NAME, FORM_FIELDS.LAST_NAME];

  return getUserProgramFields(fields, fieldsToSkip).map(field => {
    const { label } = field;
    let value = userDetails[label];

    if (SOCIAL_NETWORKS.includes(label) && userDetails.socialMediaAccounts) {
      value = userDetails.socialMediaAccounts[label];
    }

    return {
      ...field,
      value
    };
  });
};

/**
 * Returns fields configuration for program register fields
 * @param registerFields
 * @param fieldsToSkip
 */
export const getUserProgramFields = (registerFields: string[], fieldsToSkip: string[] = []) => {
  return PROGRAM_JOIN_USER_FIELDS.filter(field => {
    const { label } = field;
    if (fieldsToSkip.includes(label)) {
      return false;
    }

    const fieldName = REGISTER_FORM_FIELDS_CUSTOM_MAPPING[label] || label;

    return registerFields?.includes(fieldName);
  });
};

/**
 * Returns whether changes may be made to a user's role in the given program. Conditions:
 * - program should be ongoing
 * - user should be active (not blocked) in the given program
 * @param userProgram
 */
export const canChangeUserProgramRole = userProgram =>
  isProgramOngoing(userProgram) && userProgram.status === PROGRAM_DETAILS_STATUS_ACTIVE;

/**
 * Groups user programs by program and user status
 * @param programs
 */
export const groupUserProgramsByStatus = programs => {
  return programs.reduce(
    (acc, program) => {
      const programCategory = resolveProgramCategoryKey(program);
      const programsByStatus = acc[programCategory];

      if (programsByStatus) {
        const date = programCategory === PROGRAM_JOIN_PENDING ? program.requestToJoinAt : program.joinedAt;
        const processedProgram = {
          ...program,
          date: date && MomentUtilities.formatDate(date),
          role: program.isPeopleManager ? USER_STATUS_MANAGER : USER_STATUS_USER,
          status: USER_PROGRAM_STATUSES[program.status]
        };
        programsByStatus.push(processedProgram);
      }

      return acc;
    },
    {
      [PROGRAM_ONGOING]: [],
      [PROGRAM_FINISHED]: [],
      [PROGRAM_JOIN_PENDING]: []
    }
  );
};

const resolveProgramCategoryKey = program => {
  if (isProgramJoinPending(program)) {
    return PROGRAM_JOIN_PENDING;
  }

  if (isProgramOngoing(program)) {
    return PROGRAM_ONGOING;
  }

  return hasUserJoinedProgram(program.status) && PROGRAM_FINISHED;
};

/**
 * Returns whether user has joined the program
 * @param userProgramStatus
 */
const hasUserJoinedProgram = userProgramStatus =>
  userProgramStatus === PROGRAM_DETAILS_JOINED || userProgramStatus === PROGRAM_DETAILS_BLOCKED;

/**
 * Returns whether user has a pending invitation for given program. Program must be ongoing.
 * @param program
 */
export const isProgramInvitationPending = program =>
  program.status === PROGRAM_DETAILS_INVITED && isProgramOngoing(program);

/**
 * Returns whether user is waiting to join the program. Program must be ongoing.
 * @param program
 */
export const isProgramJoinPending = program => program.status === PROGRAM_JOIN_PENDING && isProgramOngoing(program);

/**
 * Returns whether program should be seen as ongoing
 * @param program
 */
export const isProgramOngoing = program =>
  program.programStatus === PROGRAM_ONGOING || program.programStatus === PROGRAM_CLOSING;

/**
 * Returns whether program should be seen as finished
 * @param program
 */
export const isProgramFinished = program => program.programStatus === PROGRAM_FINISHED;

/**
 * Returns whether user should be seen as inactive on given program (has any status other than joined or program is finished).
 * @param program
 */
export const isNotActiveOnProgram = program => program.status !== PROGRAM_DETAILS_JOINED || isProgramFinished(program);
/**
 * Updates user programs on join request update
 * @param programsByStatus
 * @param joinRequestAction
 */
export const updateProgramsOnJoinValidated = (programsByStatus, { programId, operation }) => {
  const pending = programsByStatus[PROGRAM_JOIN_PENDING] || [];
  const program = pending.find(program => program.id === programId);

  if (!program) {
    return programsByStatus;
  }

  const ongoing = updateOngoingPrograms(programsByStatus[PROGRAM_ONGOING], program, operation);

  return {
    ...programsByStatus,
    [PROGRAM_JOIN_PENDING]: pending.filter(p => p !== program),
    [PROGRAM_ONGOING]: ongoing
  };
};

const updateOngoingPrograms = (ongoingPrograms = [], program, operation: PROGRAM_JOIN_OPERATION) => {
  if (operation === PROGRAM_JOIN_OPERATION.REJECT) {
    return ongoingPrograms;
  }

  const activeProgram = {
    ...program,
    status: PROGRAM_DETAILS_STATUS_ACTIVE
  };

  return [activeProgram, ...ongoingPrograms];
};
