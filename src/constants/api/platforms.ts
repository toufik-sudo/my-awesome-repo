// -----------------------------------------------------------------------------
// Platform API Constants
// Migrated from old_app/src/constants/api/platforms.ts
// -----------------------------------------------------------------------------

export enum PLATFORM_INVITE_ROLE {
  ADMIN = 1,
  MANAGER = 2
}

export enum PLATFORM_ROLE_OPERATION {
  UPDATE = 'update',
  DELETE = 'delete'
}

export enum PLATFORM_INVITATION_STATUS {
  ACTIVE = 1,
  PENDING = 2,
  BLOCKED = 3,
  EXPIRED = 4
}

export enum PLATFORM_STATUS {
  ACTIVE = 0,
  BLOCKED = 1,
  EXPIRED = 2
}
