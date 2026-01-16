import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import { useDispatch } from 'react-redux';

import GeneralBlock from 'components/molecules/block/GeneralBlock';
import ButtonFormatted from 'components/atoms/ui/ButtonFormatted';
import { PLATFORM_HIERARCHIC_TYPE } from 'constants/platforms';
import { DASHBOARD_ROUTE, PLATFORM_ID_QUERY, PLATFORMS_ROUTE, SETTINGS, WALL_ROUTE } from 'constants/routes';
import { BUTTON_MAIN_TYPE, BUTTON_MAIN_VARIANT } from 'constants/ui';
import { DEFAULT_ALL_PROGRAMS } from 'constants/wall/programButtons';
import { useSelectedProgramDesign } from 'hooks/wall/ui/useSelectedProgramColors';
import { hasAdminRights, isUserAdmin, isUserBeneficiary, isUserHyperAdmin, isUserSuperAdmin, isUserManager } from 'services/security/accessServices';
import { getSessionSelectedPlatform } from 'services/UserDataServices';
import { forceActiveProgram, setSelectedPlatform } from 'store/actions/wallActions';
import { emptyFn } from 'utils/general';

import componentStyle from 'sass-boilerplate/stylesheets/components/wall/Programs.module.scss';
import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { HTML_TAGS } from 'constants/general';

/**
 * Molecule component used to render platform block.
 * @param platform
 * @param canManagePlatform
 * @param enableOnly
 * @param onSelect
 */
const HyperPlatformBlock = ({ platform, canManagePlatform = false, enableOnly = null, onSelect, onPlatformDeveloppe }) => {
  const {
    w100,
    withSecondaryColor,
    withThirdColor,
    mb1,
    flex,
    textCenter,
    mb2,
    mt0,
    mb0,
    mt3,
    py5,
    cardTitleSmall,
    text3xl,
    dSmallTextLg,
    lh1,
    capitalize,
    disabled,
    opacity04,
    pointer,
    marquee,
    marqueeInner,
    height100,
    textLimit,
    width24rem
  } = coreStyle;

  const dispatch = useDispatch();
  const { platformSuperCTA, platformSubCTA, programBlockItem, platformIcon } = componentStyle;
  const { id, hierarchicType, platformType, subPlatforms } = platform;
  const isIndependentPlatform = hierarchicType === PLATFORM_HIERARCHIC_TYPE.INDEPENDENT;

  const isDisabled = useMemo(() => enableOnly && (!enableOnly.includes(hierarchicType) || !hasAdminRights(platform)), [
    platform,
    enableOnly
  ]);

  let blockStyle = '';
  let blockBtnStyle = '';
  if (isDisabled) {
    blockStyle = `${disabled} ${opacity04}`;
  }
  if ((platform.hierarchicType === PLATFORM_HIERARCHIC_TYPE.SUB_PLATFORM && platform.nrOfPrograms == 0)) {
    blockBtnStyle = `${disabled} ${opacity04}`;
  }


  let showSuperPlatformCta = true;
  const isSuperPlatform = hierarchicType === PLATFORM_HIERARCHIC_TYPE.SUPER_PLATFORM;
  const isSubPlatform = hierarchicType === PLATFORM_HIERARCHIC_TYPE.SUB_PLATFORM;
  if (platform && isSuperPlatform) {
    showSuperPlatformCta = subPlatforms && subPlatforms.length > 0;
  }

  let platformCTAClass = platformSuperCTA;
  if ([PLATFORM_HIERARCHIC_TYPE.SUB_PLATFORM, PLATFORM_HIERARCHIC_TYPE.INDEPENDENT].includes(hierarchicType)) {
    platformCTAClass = platformSubCTA;
  } else if (isSuperPlatform) {
    platformCTAClass = platformSuperCTA;
  }

  const { colorWidgetTitle } = useSelectedProgramDesign();
  const intlPrefix = 'program.block.cta';
  const hasName = platform.name && platform.name.length > 20;
  const isHyperAdmin = isUserHyperAdmin(platform.role);
  const isSuperAdmin = isUserSuperAdmin(platform.role);
  const isAdmin = isUserAdmin(platform.role);
  const isBeneficiary = isUserBeneficiary(platform.role);
  const isManager = isUserManager(platform.role);
  const enableChoice = enableOnly && !isDisabled && (isHyperAdmin || isSuperAdmin);

  const onPlatformOpen = async () => {
    const mainSubPlatform = platform.subPlatforms;
    const platformSelected = mainSubPlatform.length ? mainSubPlatform[0] : platform;
    const programId =
      (platform.program && platform.program.id) || platformSelected.programs.length > 1
        ? DEFAULT_ALL_PROGRAMS
        : (platform.program && platform.program.id) ||
        (platformSelected.programs[0] && platformSelected.programs[0].id) ||
        null;
    const { selectedPlatform } = getSessionSelectedPlatform();
    const activePlatform = platformSelected || platform || selectedPlatform || null;
    const forcedPlatformId = (activePlatform && activePlatform.id) || null;
    const activeProgramPayload = {
      unlockSelection: true,
      programId: programId,
      forcedPlatformId: forcedPlatformId
    };
    await dispatch(forceActiveProgram(activeProgramPayload));
    await dispatch(setSelectedPlatform(activePlatform));

    const openToRoute =
      !isUserAdmin(platform.role) && forcedPlatformId
        ? WALL_ROUTE + PLATFORM_ID_QUERY + forcedPlatformId
        : DASHBOARD_ROUTE;

    window.location = (openToRoute as unknown) as Location;
  };

  return (
    <GeneralBlock
      className={`${textCenter} ${height100} ${mt0} ${mb0} ${py5} ${flex} ${coreStyle['flex-direction-column']
        } ${blockStyle} ${enableOnly && !isDisabled ? pointer : ''}`}
      handleClick={enableOnly && !isDisabled ? () => onSelect(platform) : emptyFn}
    >
      {canManagePlatform && (
        <Link to={`${PLATFORMS_ROUTE}/${hierarchicType}${SETTINGS}/${id}`}>
          <FontAwesomeIcon icon={faCog} className={platformIcon} />
        </Link>
      )}
      <div className={`${coreStyle['flex-center-vertical']} ${programBlockItem} ${coreStyle['flex-direction-column']}`}>
        {isIndependentPlatform && (
          <h4 className={`${cardTitleSmall} ${mt0}  ${capitalize}`}>{platformType && platformType.name}</h4>
        )}
        {isSuperPlatform && <h4 className={`${cardTitleSmall} ${withSecondaryColor} ${mt0} ${mb2} ${coreStyle['flex-center-vertical']}`}>
          {/* <FontAwesomeIcon className={`${withFontSmall} ${mr1}`} icon={isOpen ? faLockOpen : faLock} /> */}
          <DynamicFormattedMessage id={`program.superplatform.name`} tag={HTML_TAGS.SPAN} />
        </h4>}
        {isSubPlatform && <h4 className={`${cardTitleSmall} ${withThirdColor} ${mt0} ${mb2} ${coreStyle['flex-center-vertical']}`}>
          {/* <FontAwesomeIcon className={`${withFontSmall} ${mr1}`} icon={isOpen ? faLockOpen : faLock} /> */}
          <DynamicFormattedMessage id={`program.subplatform.name`} tag={HTML_TAGS.SPAN} />
        </h4>}
        <p
          style={{ color: colorWidgetTitle }}
          className={`${text3xl} ${dSmallTextLg} ${lh1} ${mt3} ${!colorWidgetTitle ? withSecondaryColor : ''} ${mb2} ${hasName ? marquee : ''} ${textLimit} ${width24rem}`}
        >
          <span className={hasName ? marqueeInner : ''}>{platform.name}</span>
        </p>
        {id && showSuperPlatformCta && (
          <div>
            {!(isAdmin || isBeneficiary || isManager) && <ButtonFormatted
              type={BUTTON_MAIN_TYPE.PRIMARY}
              className={`${mb1} ${w100} ${platformCTAClass} ${isDisabled ? blockStyle : ''}`}
              buttonText={`${intlPrefix}${enableChoice ? '.choose' : ''}`}
              onClick={enableChoice ? () => onSelect(platform) : onPlatformOpen}
              disabled={isDisabled}
            />}
            <ButtonFormatted
              type={isSuperPlatform ? BUTTON_MAIN_TYPE.PRIMARY_INVERTED : BUTTON_MAIN_TYPE.SECONDARY_INVERTED}
              className={`${w100} ${componentStyle.platformDveloppeBtn} ${(isDisabled || (platform.hierarchicType === PLATFORM_HIERARCHIC_TYPE.SUB_PLATFORM && platform.nrOfPrograms == 0)) ? blockBtnStyle : ''}`}
              buttonText={`${intlPrefix}${isSuperPlatform ? '.platforms':'.programs'}`}
              onClick={() => onPlatformDeveloppe(id, isSuperPlatform)}
              disabled={isDisabled || (platform.hierarchicType === PLATFORM_HIERARCHIC_TYPE.SUB_PLATFORM && platform.nrOfPrograms == 0)}
            />
          </div>
        )}
      </div>
    </GeneralBlock>
  );
};

export default HyperPlatformBlock;
