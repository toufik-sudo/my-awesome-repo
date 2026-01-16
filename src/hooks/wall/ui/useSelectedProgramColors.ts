import { BLACK, WHITE } from 'constants/general';
import { ROLE } from 'constants/security/access';
import { COLOR_SIDEBAR, COLOR_TITLES, CONTENT, FONT, MAIN, MENU, ROBOTO, TASK } from 'constants/wall/design';
import { useUserRole } from 'hooks/user/useUserRole';
import { useWallRoute } from 'hooks/wall/useWallRoute';
import { useWallSelection } from 'hooks/wall/useWallSelection';
import { isUserAdmin, isUserBeneficiary } from 'services/security/accessServices';
import { getDefaultColorsCode } from 'utils/getDefaultColorsCode';

/**
 * Hook used to get selected program colors (default if nothing is added)
 *
 * @param onLaunch
 */
export const useSelectedProgramDesign = (onLaunch = false) => {
  const { programs, selectedProgramIndex } = useWallSelection();
  const userRole = useUserRole();
  const { isWallRoute, isCommunicationRoute } = useWallRoute();

  const selectedProgram = programs[selectedProgramIndex];
  const defaultTitle = getDefaultColorsCode(COLOR_TITLES);
  const defaultSidebar = getDefaultColorsCode(COLOR_SIDEBAR);
  const defaultMain = getDefaultColorsCode(MAIN);
  const defaultContent = getDefaultColorsCode(CONTENT);
  const defaultFontColor = getDefaultColorsCode(FONT);
  const defaultColorTask = getDefaultColorsCode(TASK);
  const defaultColorMenu = getDefaultColorsCode(MENU);
  const defaultFont = ROBOTO;

  let colorMainButtons = defaultMain;
  let font = defaultFont;
  let colorTitle = defaultTitle;
  let colorSidebar = defaultSidebar;
  let colorContent = defaultContent;
  let colorTask = defaultColorTask;
  let colorFont = defaultFontColor;
  let colorMenu = defaultColorMenu;
  let colorWidgetTitle = '';
  let colorMainButtonsBackground = defaultMain;
  let colorMainButtonText = WHITE;
  let colorProgramSliderBorder = '';

  // if the user is a beneficiary, then the content has to be shown in selected program's design colors
  // if the user is not a beneficiary, then we must use the default colors for launching a program cube details
  if (!onLaunch && (isUserBeneficiary(userRole) || isUserAdmin(userRole))) {
    const isUserHyperOrSuperAdmin = userRole === ROLE.SUPER_ADMIN || userRole === ROLE.HYPER_ADMIN;
    const isUserHyperOrSuperCommunityManager =
      userRole === ROLE.SUPER_COMMUNITY_MANAGER || userRole === ROLE.HYPER_COMMUNITY_MANAGER;
    const fallBackColor = isUserHyperOrSuperAdmin || isUserHyperOrSuperCommunityManager ? BLACK : defaultMain;
    if (isUserHyperOrSuperAdmin || isUserHyperOrSuperCommunityManager) {
      colorMainButtonsBackground = colorWidgetTitle = colorProgramSliderBorder = colorMainButtons = colorTitle = BLACK;
      colorMainButtonText = WHITE;
    }

    if (selectedProgram && selectedProgram.design) {
      colorTitle = selectedProgram.design.colorTitles || defaultTitle;
      colorSidebar = selectedProgram.design.colorSidebar || defaultSidebar;
      colorMainButtons =
        ((isWallRoute || isCommunicationRoute) && selectedProgram.design.colorMainButtons) || defaultMain;
      colorContent = selectedProgram.design.colorContent || defaultContent;
      colorTask = selectedProgram.design.colorTask || defaultColorTask;
      colorFont = selectedProgram.design.colorFont || defaultFontColor;
      colorMenu = selectedProgram.design.colorMenu || defaultColorMenu;
      colorMainButtonsBackground =
        ((isWallRoute || isCommunicationRoute) && selectedProgram.design.colorMainButtons) || fallBackColor;
      colorMainButtonText = WHITE;
      font = selectedProgram.design.font || defaultFont;
      colorProgramSliderBorder = isWallRoute || isCommunicationRoute ? colorMainButtons : '';
      if (!isWallRoute && (isUserHyperOrSuperAdmin || isUserHyperOrSuperCommunityManager)) {
        colorProgramSliderBorder = colorMainButtonsBackground;
      }
    }
  }

  return {
    colorTitle,
    colorContent,
    colorTask,
    font,
    colorMainButtons,
    colorFont,
    colorSidebar,
    colorMenu,
    colorWidgetTitle,
    colorMainButtonsBackground,
    colorMainButtonText,
    colorProgramSliderBorder
  };
};
