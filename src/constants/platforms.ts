// -----------------------------------------------------------------------------
// Platform Constants
// Migrated from old_app/src/constants/platforms.ts
// -----------------------------------------------------------------------------

export enum PLATFORM_HIERARCHIC_TYPE {
  INDEPENDENT = 1,
  SUB_PLATFORM = 2,
  SUPER_PLATFORM = 3,
  HYPER_PLATFORM = 4
}

/**
 * Platform Status Enum
 */
export enum PLATFORM_STATUS {
  ACTIVE = 'active',
  EXPIRED = 'expired',
  SUSPENDED = 'suspended'
}
