import { PROGRAM_BTN_CLASS } from 'constants/general';

export const PROGRAM_BUTTON_FIELDS = [
  { textId: 'welcome.page.launch.full', className: PROGRAM_BTN_CLASS.DISABLED },
  { textId: 'form.submit.duplicate', className: PROGRAM_BTN_CLASS.DISABLED },
  { textId: 'welcome.page.launch.quick', className: PROGRAM_BTN_CLASS.SECONDARY }
];

export const PROGRAM_BUTTON_FIELDS_2 = [{ textId: 'form.submit.choose', className: PROGRAM_BTN_CLASS.PRIMARY }];

export const VIEWS = {
  SIMPLIFIED: 'simplified',
  WALL: 'wall'
};

export const DEFAULT_ALL_PROGRAMS = 'all.programs';
export const DEFAULT_WALL_ALL_PROGRAMS = 'wall.' + DEFAULT_ALL_PROGRAMS;
