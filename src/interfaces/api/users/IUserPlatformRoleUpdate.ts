import { PLATFORM_INVITE_ROLE, PLATFORM_ROLE_OPERATION } from 'constants/api/platforms';

export interface IUserPlatformRoleUpdate {
  platformId: number;
  role?: PLATFORM_INVITE_ROLE;
  operation: PLATFORM_ROLE_OPERATION;
}
