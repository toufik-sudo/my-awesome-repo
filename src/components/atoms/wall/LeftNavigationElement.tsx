import React, { useEffect, useRef, useState } from 'react';
import ReactTooltip from 'react-tooltip';

import NavigationLink from 'components/atoms/wall/NavigationLink';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { HTML_TAGS, WINDOW_SIZES } from 'constants/general';
import { useSelectedProgramDesign } from 'hooks/wall/ui/useSelectedProgramColors';
import { useProgramDeclarationData } from 'hooks/wall/useProgramDeclarationData';
import { useWallRoute } from 'hooks/wall/useWallRoute';
import { FREEMIUM, PROGRAM_TYPES } from 'constants/wall/launch';
import { DECLARE } from 'services/wall/navigation';
import { TOOLTIP_FIELDS } from 'constants/tootltip';
import { useIntl } from 'react-intl';
import { useWindowSize } from '../../../hooks/others/useWindowSize';
import { DEFAULT_ALL_PROGRAMS } from '../../../constants/wall/programButtons';
import useSelectedProgram from '../../../hooks/wall/useSelectedProgram';
import { useSelector } from 'react-redux';
import { IStore } from '../../../interfaces/store/IStore';
import { useUserRole } from '../../../hooks/user/useUserRole';
import { isUserBeneficiary } from '../../../services/security/accessServices';

/**
 * Atom component used to render left navigation item
 * @param title
 * @param icon
 * @param url
 * @param closeNav
 * @param className
 * @param isDisabled
 * @param external
 * @constructor
 *
 * @see LeftNavigationElementStory
 */
const LeftNavigationElement = ({
    title,
    icon = null,
    url,
    closeNav,
    className = '',
    isDisabled = false,
    external = false,
    isCollapsed = false
  }) => {
    const { formatMessage } = useIntl();
    const { colorMenu } = useSelectedProgramDesign();
    const role = useUserRole();
    const selectedProgram = useSelectedProgram();
    const { programs } = useSelector((store: IStore) => store.wallReducer);
    const { isWallRoute, isDeclarationRoute, isCommunicationRoute, isUsersRoute } = useWallRoute();
    const { beneficiaryCanDeclare, program } = useProgramDeclarationData();
    const refDeclareButton = useRef();
    const [initialDeclarePos, setInitialDeclarePos] = useState();
    const isBeneficiary = isUserBeneficiary(role);
    const {
      windowSize: { width: windowWidth }
    } = useWindowSize();
    const isMobile = windowWidth < WINDOW_SIZES.DESKTOP_SMALL;
    const hasOnlyFreemiumPrograms = !programs.some(
      program => program.name !== DEFAULT_ALL_PROGRAMS && program.programType !== PROGRAM_TYPES[FREEMIUM]
    );
    const shouldDisplayCustomColors = isWallRoute || isDeclarationRoute || isCommunicationRoute || isUsersRoute;
    const isDeclareButton = title.includes(DECLARE);
    const isFreemium = program.programType === PROGRAM_TYPES[FREEMIUM];


    useEffect(() => {
      if (isDeclareButton && !initialDeclarePos && refDeclareButton.current) {
        // @ts-ignore
        setInitialDeclarePos(refDeclareButton.current.getBoundingClientRect().y);
      }
    }, []);
    // If user can't declare, the menu item should not be present
    if (isDeclareButton) {
      if (!beneficiaryCanDeclare) {
        return <div></div>;
      }

      if (
        isFreemium ||
        (isBeneficiary && hasOnlyFreemiumPrograms && selectedProgram && selectedProgram.name === DEFAULT_ALL_PROGRAMS)
      ) {
        isDisabled = true;
      }
    }

    const tooltipId = `nav-tooltip-${title.replace(/\./g, '-')}`;
    const tooltipText = formatMessage({ id: title });

    return (
      <div>
        <li
          data-tip={tooltipText}
          data-for={tooltipId}
          onClick={!isDeclareButton && !isFreemium ? (() => closeNav()) : undefined}
          ref={refDeclareButton}
        >
          <NavigationLink {...{ url, isDisabled, external }}>
            {icon && <span style={{ color: shouldDisplayCustomColors ? colorMenu : '' }}>{icon}</span>}
            {!isCollapsed && (
              <DynamicFormattedMessage
                style={{ color: shouldDisplayCustomColors ? colorMenu : '' }}
                className={className || ''}
                tag={HTML_TAGS.SPAN}
                id={title}
              />
            )}
          </NavigationLink>
        </li>
        <ReactTooltip
          id={tooltipId}
          place={TOOLTIP_FIELDS.PLACE_RIGHT}
          effect={TOOLTIP_FIELDS.EFFECT_SOLID}
          className="nav-tooltip"
          delayShow={isCollapsed ? 200 : 400}
          delayHide={100}
          overridePosition={({ left, top }) => ({ left: left + 10, top })}
          resizeHide={false}
        >
          {isDeclareButton && isDisabled 
            ? formatMessage({ id: `wall.navigation.declare.freemium` })
            : tooltipText
          }
        </ReactTooltip>
      </div>
    );
  };

export default LeftNavigationElement;
