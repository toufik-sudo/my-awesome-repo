// -----------------------------------------------------------------------------
// User Programs Constants
// Migrated from old_app/src/constants/api/userPrograms.ts
// -----------------------------------------------------------------------------

export enum USER_PROGRAM_STATUS {
  ACTIVE = 1,
  INACTIVE = 2,
  BLOCKED = 3,
  PENDING = 4,
  REJECTED = 5
}

export const PROGRAM_JOIN_OPERATION = {
  ACCEPT: 'accept',
  REJECT: 'reject'
} as const;

export const PROGRAM_DETAILS_STATUS_ACTIVE = 'active';
export const PROGRAM_DETAILS_STATUS_BLOCKED = 'blocked';
export const PROGRAM_DETAILS_STATUS_PENDING = 'pending';
export const VISITED_WALL = 'visitedWall';

// Program join statuses
export const PROGRAM_JOIN_PENDING = 'pending';
export const PROGRAM_DETAILS_JOINED = 'joined';
export const PROGRAM_DETAILS_DECLINED = 'declined';
export const PROGRAM_DETAILS_BLOCKED = 'blocked';
export const PROGRAM_DETAILS_INVITED = 'invited';

// Default query sizes
export const DEFAULT_PROGRAMS_QUERY = Object.freeze({ programsSize: 100000 });
export const DEFAULT_ADMIN_PLATFORMS_QUERY = Object.freeze({ platformsSize: 200 });
