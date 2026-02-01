// -----------------------------------------------------------------------------
// Design Constants
// Migrated from old_app/src/constants/wall/design.ts
// -----------------------------------------------------------------------------

// Colors
export const MAIN = 'colorMainButtons';
export const SIDEBARS_TITLES = 'colorSidebarTitles';
export const MENU = 'colorMenu';
export const FONT = 'colorFont';
export const TASK = 'colorTask';
export const CONTENT = 'colorContent';
export const BACKGROUND = 'colorBackground';
export const COLOR_TITLES = 'colorTitles';
export const COLOR_SIDEBAR = 'colorSidebar';
export const CONTENT_TASK = 'colorContentTask';
export const HYPER_ADMIN_COLOR = '#3e216b';
export const SUPER_ADMIN_COLOR = '#3e216b';

export interface IColorConfig {
  name: string;
  color?: string;
  colors?: Array<{ color: string; name: string }>;
}

export const CUSTOMISE_COLORS: IColorConfig[] = [
  { name: MAIN, color: '#EC407A' },
  {
    name: SIDEBARS_TITLES,
    colors: [
      { color: '#3e216b', name: COLOR_SIDEBAR },
      { color: '#3e216b', name: COLOR_TITLES }
    ]
  },
  { name: MENU, color: '#fff' },
  {
    name: CONTENT_TASK,
    colors: [
      { color: '#3e216b', name: CONTENT },
      { color: '#78bb7bcf', name: TASK }
    ]
  },
  { name: FONT, color: '#000000' },
  { name: BACKGROUND, color: '#FFFFFF' }
];

// Fonts
export const ROBOTO = 'Roboto';
export const LATO = 'Lato';
export const ADAMINA = 'Adamina';
export const COMFORTAA = 'Comfortaa';
export const OPEN_SANS = 'Open Sans';
export const CUSTOMIZE_FONTS = [ROBOTO, LATO, ADAMINA, COMFORTAA, OPEN_SANS];

export const UPPER = 'upper';
export const LOWER = 'lower';
export const SAMPLE_TEXT_LIST = [UPPER, LOWER];

// User status operations
export const USER_STATUS_OPERATION = {
  active: 'block',
  blocked: 'unblock',
  VISITED: 'visitedWall'
} as const;
