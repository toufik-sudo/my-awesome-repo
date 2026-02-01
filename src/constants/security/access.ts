// -----------------------------------------------------------------------------
// Role and Access Constants
// Migrated from old_app/src/constants/security/access.ts
// -----------------------------------------------------------------------------

export enum ROLE {
  ADMIN = 1,
  TEAM_MANAGER = 2,
  MANAGER = 2, // Alias for TEAM_MANAGER
  BENEFICIARY = 3,
  SUPER_ADMIN = 4,
  SUPER_COMMUNITY_MANAGER = 5,
  HYPER_ADMIN = 6,
  HYPER_COMMUNITY_MANAGER = 7
}

export const ALL_ADMIN_ROLES = [ROLE.ADMIN, ROLE.SUPER_ADMIN, ROLE.HYPER_ADMIN];
export const ALL_MANAGER_ROLES = [ROLE.TEAM_MANAGER, ROLE.SUPER_COMMUNITY_MANAGER, ROLE.HYPER_COMMUNITY_MANAGER];

export const ALL_ROLES_EXCEPT_BENEFICIARY = Object.values(ROLE).filter(
  val => typeof val === 'number' && val !== ROLE.BENEFICIARY
) as ROLE[];

export const ALL_ROLES_EXCEPT_ADMIN = Object.values(ROLE).filter(
  val => typeof val === 'number' && val !== ROLE.ADMIN
) as ROLE[];

export enum HIERARCHIC_ROLE {
  REGULAR = 1,
  HYPER_ADMIN = 2,
  HYPER_COMMUNITY_MANAGER = 3
}

export enum ACCOUNT_STATUS {
  NOT_VERIFIED = 0
}
