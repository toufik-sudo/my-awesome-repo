// -----------------------------------------------------------------------------
// Program Constants
// Migrated from old_app/src/constants/programs.ts
// -----------------------------------------------------------------------------

import { PROGRAM_TYPES } from '@/constants/wall/launch';

export interface TypeFilterOption {
  value: number | undefined;
  label: string;
}

export const TYPE_FILTER_OPTIONS: TypeFilterOption[] = [
  { value: undefined, label: 'program.type.all' },
  ...Object.entries(PROGRAM_TYPES).map(([key, value]) => ({ 
    value: value as number, 
    label: `program.type.${key}` 
  }))
];

export const PROGRAM_TYPE_LABELS: Record<number, string> = {
  1: 'Challenge',
  2: 'Loyalty',
  3: 'Sponsorship',
  4: 'Freemium'
};

export enum PROGRAM_JOIN_STEPS {
  PERSONAL_DATA = 0,
  NEWSLETTER = 1,
  PENDING_VALIDATION = 2
}

export const PROGRAM_JOIN_FIRST_STEP = PROGRAM_JOIN_STEPS.PERSONAL_DATA;

export const PROGRAM_JOIN_STEPS_ORDER = Object.values(PROGRAM_JOIN_STEPS)
  .filter(val => typeof val === 'number')
  .sort();

export const DEFAULT_HYPER_PROGRAMS_LIST_SIZE = 12;
export const DEFAULT_HYPER_PROGRAMS_OFFSET = 10;

export const PROGRAM_STATUS_LABELS: Record<number | string, string> = {
  0: 'Draft',
  1: 'Active',
  2: 'Paused',
  3: 'Finished',
  'active': 'Active',
  'pending': 'Pending',
  'draft': 'Draft',
  'finished': 'Finished'
};
