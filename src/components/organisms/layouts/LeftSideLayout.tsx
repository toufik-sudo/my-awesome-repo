// import React from 'react';

// import WallLeftNavigation from 'components/molecules/wall/WallLeftNavigation';
// import LogoImageLink from 'components/atoms/ui/LogoImageLink';
// import UserInfo from 'components/molecules/wall/UserInfo';
// import BaseWallWrapper from 'components/molecules/wall/BaseWallWrapper';
// import NavbarBurger from 'components/molecules/navigation/NavbarBurger';
// import LogOutModal from 'components/organisms/modals/LogOutModal';
// import CompanyLogo from 'components/atoms/ui/CompanyLogo';
// import LogoutButton from 'components/atoms/wall/LogoutButton';
// import { PRIMARY, WALL_TYPE } from 'constants/general';
// import { useNavBurger } from 'hooks/nav/useNavBurger';
// import { useWallSelection } from 'hooks/wall/useWallSelection';
// import { BACKGROUND, COLOR_SIDEBAR, HYPER_ADMIN_COLOR, SUPER_ADMIN_COLOR } from 'constants/wall/design';
// import { getDefaultColorsCode } from 'utils/getDefaultColorsCode';
// import { useWallRoute } from 'hooks/wall/useWallRoute';
// import { useUserRole } from 'hooks/user/useUserRole';
// import { ROLE } from 'constants/security/access';

// import componentStyle from 'assets/style/components/LeftSideLayout.module.scss';

// /**
//  * Organism layout component with left logo sidebar (customize with PRIMARY | SECONDARY)
//  *
//  * @param children
//  * @param theme
//  * @param hasUserIcon
//  * @param wallPage
//  * @constructor
//  */
// const LeftSideLayout = ({ children, hasUserIcon = false, theme = PRIMARY, optionalClass = '' }) => {
//   const { toggleClass, isChecked, closeNav } = useNavBurger();
//   const { navigation, leftNav, logoImg, logOutBottom } = componentStyle;
//   const isWallType = theme === WALL_TYPE;
//   const { isWallRoute, isDeclarationRoute, isCommunicationRoute, isUsersRoute } = useWallRoute();
//   const shouldDisplayCustomColors = isWallRoute || isDeclarationRoute || isCommunicationRoute || isUsersRoute;

//   const userRole = useUserRole();
//   let outputChildren = children;

//   const { programs, selectedProgramIndex } = useWallSelection();
//   const selectedProgram = programs[selectedProgramIndex];
//   const defaultBackgroundColor = isWallRoute && getDefaultColorsCode(BACKGROUND);

//   const design = selectedProgram && selectedProgram.design;
//   const showCompanyLogo = shouldDisplayCustomColors && design && design.companyLogoUrl;
//   let menuBackground = '';
//   let backgroundColor = '';

//   if (shouldDisplayCustomColors && selectedProgram && selectedProgram.design) {
//     menuBackground = selectedProgram.design.colorSidebar;
//     backgroundColor = selectedProgram.design.colorBackground;
//   }

//   if (isWallRoute && (!selectedProgram || !selectedProgram.design) && userRole === ROLE.HYPER_ADMIN) {
//     menuBackground = HYPER_ADMIN_COLOR;
//   }
//   if ((!isWallRoute && userRole === ROLE.HYPER_ADMIN) || userRole === ROLE.HYPER_COMMUNITY_MANAGER) {
//     menuBackground = HYPER_ADMIN_COLOR;
//   }
//   if (isWallRoute && (!selectedProgram || !selectedProgram.design) && userRole === ROLE.SUPER_ADMIN) {
//     menuBackground = SUPER_ADMIN_COLOR;
//   }
//   if ((!isWallRoute && userRole === ROLE.SUPER_ADMIN) || userRole === ROLE.SUPER_COMMUNITY_MANAGER) {
//     menuBackground = SUPER_ADMIN_COLOR;
//   }
//   if (isWallType) {
//     outputChildren = <BaseWallWrapper outputChildren={children} theme={theme} />;
//   }

//   return (
//     <div
//       className={`${leftNav} ${componentStyle[theme]} ${optionalClass}`}
//       style={{ background: backgroundColor ? backgroundColor : defaultBackgroundColor }}
//     >
//       {isWallType && <NavbarBurger {...{ toggleClass, isChecked }} />}
//       <div
//         className={`${navigation}`}
//         style={{
//           background: menuBackground && menuBackground !== getDefaultColorsCode(COLOR_SIDEBAR) ? menuBackground : '',
//           overflow: 'hidden'
//         }}
//       >
//         <LogoImageLink className={logoImg} />
//         <LogOutModal />
//         {hasUserIcon && <UserInfo />}
//         {showCompanyLogo && <CompanyLogo companyLogo={design && design.companyLogoUrl} />}
//         {isWallType && <WallLeftNavigation {...{ closeNav, showCompanyLogo }} />}
//         {!isWallType && userRole && (
//           <div className={logOutBottom}>
//             <LogoutButton />
//           </div>
//         )}
//       </div>
//       {outputChildren}
//     </div>
//   );

  
// };

// export default LeftSideLayout;


import React from 'react';
import WallLeftNavigation from 'components/molecules/wall/WallLeftNavigation';
import LogoImageLink from 'components/atoms/ui/LogoImageLink';
import UserInfo from 'components/molecules/wall/UserInfo';
import BaseWallWrapper from 'components/molecules/wall/BaseWallWrapper';
import NavbarBurger from 'components/molecules/navigation/NavbarBurger';
import LogOutModal from 'components/organisms/modals/LogOutModal';
import CompanyLogo from 'components/atoms/ui/CompanyLogo';
import LogoutButton from 'components/atoms/wall/LogoutButton';
import SidebarCollapseToggle from 'components/atoms/wall/SidebarCollapseToggle';
import { PRIMARY, WALL_TYPE } from 'constants/general';
import { useNavBurger } from 'hooks/nav/useNavBurger';
import { useSidebarCollapse } from 'hooks/nav/useSidebarCollapse';
import { useWallSelection } from 'hooks/wall/useWallSelection';
import { BACKGROUND, COLOR_SIDEBAR, HYPER_ADMIN_COLOR, SUPER_ADMIN_COLOR } from 'constants/wall/design';
import { getDefaultColorsCode } from 'utils/getDefaultColorsCode';
import { useWallRoute } from 'hooks/wall/useWallRoute';
import { useUserRole } from 'hooks/user/useUserRole';
import { ROLE } from 'constants/security/access';

import componentStyle from 'assets/style/components/LeftSideLayout.module.scss';

const LeftSideLayout = ({ children, hasUserIcon = false, theme = PRIMARY, optionalClass = '' }) => {
  const { toggleClass, isChecked, closeNav } = useNavBurger();
  const { 
    isCollapsed, 
    isVisuallyCollapsed, 
    isHoverExpanded,
    toggleCollapse, 
    handleMouseEnter, 
    handleMouseLeave 
  } = useSidebarCollapse();
  const { navigation, leftNav, logoImg, logOutBottom, navigationCollapsed, navigationHoverExpanded, hoverExpanded } = componentStyle;
  const isWallType = theme === WALL_TYPE;
  const { isWallRoute, isDeclarationRoute, isCommunicationRoute, isUsersRoute } = useWallRoute();
  const shouldDisplayCustomColors = isWallRoute || isDeclarationRoute || isCommunicationRoute || isUsersRoute;

  const userRole = useUserRole();
  let outputChildren = children;

  const { programs, selectedProgramIndex } = useWallSelection();
  const selectedProgram = programs[selectedProgramIndex];
  const defaultBackgroundColor = isWallRoute && getDefaultColorsCode(BACKGROUND);

  const design = selectedProgram && selectedProgram.design;
  const showCompanyLogo = shouldDisplayCustomColors && design && design.companyLogoUrl;
  let menuBackground = '';
  let backgroundColor = '';

  if (shouldDisplayCustomColors && selectedProgram && selectedProgram.design) {
    menuBackground = selectedProgram.design.colorSidebar;
    backgroundColor = selectedProgram.design.colorBackground;
  }

  if (isWallRoute && (!selectedProgram || !selectedProgram.design) && userRole === ROLE.HYPER_ADMIN) {
    menuBackground = HYPER_ADMIN_COLOR;
  }
  if ((!isWallRoute && userRole === ROLE.HYPER_ADMIN) || userRole === ROLE.HYPER_COMMUNITY_MANAGER) {
    menuBackground = HYPER_ADMIN_COLOR;
  }
  if (isWallRoute && (!selectedProgram || !selectedProgram.design) && userRole === ROLE.SUPER_ADMIN) {
    menuBackground = SUPER_ADMIN_COLOR;
  }
  if ((!isWallRoute && userRole === ROLE.SUPER_ADMIN) || userRole === ROLE.SUPER_COMMUNITY_MANAGER) {
    menuBackground = SUPER_ADMIN_COLOR;
  }
  if (isWallType) {
    outputChildren = <BaseWallWrapper outputChildren={children} theme={theme} isCollapsed={isVisuallyCollapsed} />;
  }

  // Build navigation classes based on collapsed and hover states
  const getNavigationClasses = () => {
    let classes = navigation;
    if (isVisuallyCollapsed) {
      classes += ` ${navigationCollapsed}`;
    } else if (isHoverExpanded) {
      classes += ` ${navigationHoverExpanded}`;
    }
    return classes;
  };

  // Build layout classes
  const getLayoutClasses = () => {
    let classes = `${leftNav} ${componentStyle[theme]} ${optionalClass}`;
    if (isCollapsed) {
      classes += ` ${componentStyle.collapsed}`;
    }
    if (isHoverExpanded) {
      classes += ` ${hoverExpanded}`;
    }
    return classes;
  };

  return (
    <div
      className={getLayoutClasses()}
      style={{ background: backgroundColor ? backgroundColor : defaultBackgroundColor }}
    >
      {isWallType && <NavbarBurger {...{ toggleClass, isChecked }} />}
      <div
        className={getNavigationClasses()}
        style={{
          background: menuBackground && menuBackground !== getDefaultColorsCode(COLOR_SIDEBAR) ? menuBackground : '',
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <LogoImageLink className={logoImg} isCollapsed={isVisuallyCollapsed} />
        <LogOutModal />
        {hasUserIcon && !isVisuallyCollapsed && <UserInfo />}
        {/* CompanyLogo moved to WallRightBlock */}
        {isWallType && <WallLeftNavigation {...{ closeNav, showCompanyLogo, isCollapsed: isVisuallyCollapsed }} />}
        {!isWallType && userRole && (
          <div className={logOutBottom}>
            <LogoutButton isCollapsed={isVisuallyCollapsed} />
          </div>
        )}
        {isWallType && <SidebarCollapseToggle isCollapsed={isCollapsed} onToggle={toggleCollapse} />}
      </div>
      {outputChildren}
    </div>
  );
};

export default LeftSideLayout;
