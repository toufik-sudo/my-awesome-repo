import {
  PROGRAM_DETAILS_STATUS_ACTIVE,
  PROGRAM_DETAILS_STATUS_BLOCKED,
  PROGRAM_DETAILS_STATUS_PENDING,
  VISITED_WALL
} from 'constants/api/userPrograms';
import { faCheck, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import style from 'sass-boilerplate/stylesheets/components/wall/WallUserDetails.module.scss';
import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';

const { userDetailsDanger, userDetailsCheck } = style;
const { withPrimaryColor, withDangerColor, withWarningColor } = coreStyle;

// COLORS
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

export const CUSTOMISE_COLORS = [
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

// FONTS
export const ROBOTO = 'Roboto';
export const LATO = 'Lato';
export const ADAMINA = 'Adamina';
export const COMFORTAA = 'Comfortaa';
export const OPEN_SANS = 'Open Sans';
export const CUSTOMIZE_FONTS = [ROBOTO, LATO, ADAMINA, COMFORTAA, OPEN_SANS];

export const UPPER = 'upper';
export const LOWER = 'lower';
export const SAMPLE_TEXT_LIST = [UPPER, LOWER];

// STYLES
export const USER_DETAILS_STYLE = {
  [PROGRAM_DETAILS_STATUS_ACTIVE]: {
    statusClass: withPrimaryColor,
    iconClass: userDetailsDanger,
    icon: faTimesCircle
  },
  [PROGRAM_DETAILS_STATUS_BLOCKED]: {
    statusClass: withDangerColor,
    iconClass: userDetailsCheck,
    icon: faCheck
  },
  [PROGRAM_DETAILS_STATUS_PENDING]: {
    statusClass: withWarningColor
  }
};

export const USER_STATUS_OPERATION = {
  [PROGRAM_DETAILS_STATUS_ACTIVE]: 'block',
  [PROGRAM_DETAILS_STATUS_BLOCKED]: 'unblock',
  VISITED: VISITED_WALL
};
