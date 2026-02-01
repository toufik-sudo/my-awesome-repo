// -----------------------------------------------------------------------------
// Program Buttons Constants
// Migrated from old_app/src/constants/wall/programButtons.ts
// -----------------------------------------------------------------------------

export const VIEWS = {
  WALL: 'wall',
  DASHBOARD: 'dashboard',
  USERS: 'users',
  DECLARATIONS: 'declarations',
  AGENDA: 'agenda',
  SETTINGS: 'settings',
  REWARDS: 'rewards'
} as const;

export type ViewType = typeof VIEWS[keyof typeof VIEWS];

export const PROGRAM_BUTTONS = {
  WALL: 'wall',
  DASHBOARD: 'dashboard',
  USERS: 'users',
  DECLARATIONS: 'declarations',
  AGENDA: 'agenda'
} as const;

export type ProgramButtonType = typeof PROGRAM_BUTTONS[keyof typeof PROGRAM_BUTTONS];

// Default program names
export const DEFAULT_ALL_PROGRAMS = 'allPrograms';
export const DEFAULT_WALL_ALL_PROGRAMS = 'wall.allPrograms';
