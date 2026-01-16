import { USER_DECLARATION_STATUS_OPERATION } from 'constants/api/declarations';

export interface IUserDeclarationValidation {
  id: number;
  hash: string;
  operation: USER_DECLARATION_STATUS_OPERATION;
}
