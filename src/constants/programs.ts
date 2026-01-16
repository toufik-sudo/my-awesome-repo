import { PROGRAM_TYPES } from 'constants/wall/launch';

export const TYPE_FILTER_OPTIONS = [
  { value: undefined, label: `program.type.all` },
  ...Object.values(PROGRAM_TYPES).map(value => ({ value, label: `program.type.${value}` }))
];

export enum PROGRAM_JOIN_STEPS {
  PERSONAL_DATA = 0,
  NEWSLETTER = PERSONAL_DATA + 1,
  PENDING_VALIDATION = NEWSLETTER + 1
}

export const PROGRAM_JOIN_FIRST_STEP = PROGRAM_JOIN_STEPS.PERSONAL_DATA;

export const PROGRAM_JOIN_STEPS_ORDER = Object.values(PROGRAM_JOIN_STEPS)
  .filter(val => typeof val === 'number')
  .sort();

export const DEFAULT_HYPER_PROGRAMS_LIST_SIZE = 12;
export const DEFAULT_HYPER_PROGRAMS_OFFSET = 10;
