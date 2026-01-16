import { PROGRAM_JOIN_OPERATION, PROGRAM_INVITATION_OPERATION } from 'constants/api/userPrograms';

export interface IProgramJoinValidation {
  uuid: string;
  programId: number;
  operation: PROGRAM_JOIN_OPERATION | PROGRAM_INVITATION_OPERATION;
  newsletter?: boolean;
}
