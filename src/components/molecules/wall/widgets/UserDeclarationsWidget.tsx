/* eslint-disable quotes */
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';

import GeneralBlock from 'components/molecules/block/GeneralBlock';
import useUserDeclarations from 'hooks/wall/useUserDeclarations';
import Loading from 'components/atoms/ui/Loading';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { HTML_TAGS, LOADER_TYPE } from 'constants/general';
import { LAUNCH_BASE, USER_DECLARATIONS_ROUTE, WALL_BENEFICIARY_DECLARATIONS_ROUTE } from 'constants/routes';
import { createDeclarationLinesLabels } from 'services/WallServices';
import { useWallRoute } from 'hooks/wall/useWallRoute';
import { useSelectedProgramDesign } from 'hooks/wall/ui/useSelectedProgramColors';

import style from 'sass-boilerplate/stylesheets/components/wall/WallUserDeclarationsBlock.module.scss';
import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';
import wallStyle from 'sass-boilerplate/stylesheets/components/wall/WallBasePageStructure.module.scss';
import wallBaseStyle from 'sass-boilerplate/stylesheets/components/wall/WallBaseBlock.module.scss';
import useSelectedProgram from '../../../../hooks/wall/useSelectedProgram';
import { FREEMIUM, PROGRAM_TYPES, PROGRAM_TYPES_NAMES } from '../../../../constants/wall/launch';
import { useUserRole } from '../../../../hooks/user/useUserRole';
import {
  getUserAuthorizations,
  isAnyKindOfAdmin,
  isAnyKindOfManager
} from '../../../../services/security/accessServices';
import { useSelector } from 'react-redux';
import { IStore } from '../../../../interfaces/store/IStore';
import { DEFAULT_ALL_PROGRAMS } from '../../../../constants/wall/programButtons';
import { getCurrentProgramDetails } from 'services/wall/blocks';
import { WALL_BLOCK } from 'constants/wall/blocks';
import { useWallSelection } from 'hooks/wall/useWallSelection';
import { getHtmlFromEditorBlocks } from 'services/WysiwygService';
import MediaBlock from '../postBlock/media/MediaBlock';
import postTabStyle from 'sass-boilerplate/stylesheets/components/wall/PostTabs.module.scss';

/**
 * Molecule component used to render user declarations block
 * @constructor
 */
const UserDeclarationsWidget = ({ programDetails, modifyProgramDesign }) => {
  const intl = useIntl();
  const { programs } = useSelector((store: IStore) => store.wallReducer);
  const { currentUserDeclarations, isBeneficiary, isLoading } = useUserDeclarations();
  const { withGrayAccentColor, withGrayColor, withFontMedium, overlayBeforeWhite, pb2, pt2, mb07, pb4 } = coreStyle;
  const { isWallRoute, isCommunicationRoute } = useWallRoute();
  const { colorMainButtons, colorWidgetTitle } = useSelectedProgramDesign();
  const {
    userDeclarationBlock,
    userDeclarationBlockTitle,
    userDeclarationBlockLink,
    userDeclarationBlockFreemium
  } = style;
  const selectedProgram = useSelectedProgram();
  const isFreemium = selectedProgram && selectedProgram.programType === PROGRAM_TYPES[FREEMIUM];
  const userRole = useUserRole();
  const userAccess = getUserAuthorizations(userRole);
  const isManager = isAnyKindOfManager(userAccess);
  let linkTranslation = 'wall.userDeclarations.block.all';
  // const hasOnlyFreemiumPrograms = !programs.some(
  //   program => program.name !== DEFAULT_ALL_PROGRAMS && program.programType !== PROGRAM_TYPES[FREEMIUM]
  // );
  //Modify Widget blocs to pub in walls only and when a wall is selected --> not in show all programs
  const currentProgramDetails = getCurrentProgramDetails(programDetails, WALL_BLOCK.DECLARATIONS_BLOCK);
  const { menuTitle, pictureUrl, content, bannerTitle } = currentProgramDetails;
  const { selectedProgramIndex, selectedProgramId } = useWallSelection();
  const [showModal, setShowModal] = useState(true);
  const role = useUserRole();
  const userRights = getUserAuthorizations(role);
  const isAnyAdmin = isAnyKindOfAdmin(userRights);
  const isAnyManager = isAnyKindOfManager(userRights);
  const programType = programDetails?.type || PROGRAM_TYPES[FREEMIUM];
  const isAllLoaded = selectedProgramIndex == 0 ? true : Object.keys(programDetails).length > 0;
  const isSelectedProgram = programs?.length > 1 && selectedProgramIndex !== 0 || programs?.length == 1 ? true : false;
  if (isFreemium && !isManager) {
    linkTranslation = 'wall.freemium.launch';
  }
  if (isBeneficiary) {
    linkTranslation = 'wall.userDeclarations.block.allBeneficiary';
  }
  // const isSelectedProgram = platform?.programs?.length > 1 && selectedProgramIndex === 0 || platform?.programs?.length == 1 ? true : false;

  //Add Bloc title and desc for social wall  --> freemium
  let blocDesc = 'wall.user.see.all';
  let imagExt = 'jpg';
  let blockTitle = 'wall.userDeclarations.block.userStatements';
  if (isSelectedProgram && isFreemium && isAllLoaded) {
    blockTitle = menuTitle;
    blocDesc = getHtmlFromEditorBlocks(content);
    imagExt = pictureUrl.substring(pictureUrl?.lastIndexOf('.') + 1) || 'jpg';
  }
  const { userBlockCount } = style;
  const { postIcon, modifyProgram } = postTabStyle;
  //For the image
  const src = isAllLoaded ? pictureUrl : '';

  const getMidContent = () => {
    if (isLoading) {
      return (
        <div className={pt2}>
          <Loading className={coreStyle.withSecondaryColor} type={LOADER_TYPE.DROPZONE} />
        </div>
      );
    }

    if (isFreemium && !(isBeneficiary || isManager)) {
      return (
        <p className={userDeclarationBlockFreemium}>
          <DynamicFormattedMessage
            style={{ textTransform: 'uppercase' }}
            id="wall.dashboard.block.freemium.start"
            tag={HTML_TAGS.SPAN}
          />
        </p>
      );
    }

    if (!currentUserDeclarations.length || isFreemium) {
      return (
        <p className={pb4}>
          <DynamicFormattedMessage
            className={`${withGrayAccentColor} ${withFontMedium}`}
            id="wall.userDeclarations.block.none"
            tag={HTML_TAGS.SPAN}
          />
        </p>
      );
    }

    return (
      <div className={`${withGrayAccentColor} ${pb2} ${pt2}`}>
        {createDeclarationLinesLabels(currentUserDeclarations, intl).map((label, index) => (
          <p className={`${withFontMedium} ${mb07}`} key={index}>
            {label}
          </p>
        ))}
      </div>
    );
  };
  // const showOverlay =
  //   (isBeneficiary && hasOnlyFreemiumPrograms && selectedProgram && selectedProgram.name === DEFAULT_ALL_PROGRAMS) ||
  //   ((isManager || isBeneficiary) && isFreemium);

  const onClick = () => {
    if(isSelectedProgram && selectedProgram.programType){
      const programType = PROGRAM_TYPES_NAMES[selectedProgram.programType]
      modifyProgramDesign(WALL_BLOCK.DECLARATIONS_BLOCK, programType);
    }
  };
  return (
    <GeneralBlock
      tooltipId="disabledWidget"
      className={`${userDeclarationBlock} ${wallStyle.hideBlockMobile} 
      `}
      
    >
      {!isAllLoaded && (
        <div className={userBlockCount}>
          <Loading className={coreStyle.withSecondaryColor} type={LOADER_TYPE.DROPZONE} />
        </div>
      )}
      {isAllLoaded && (
        <>
          {(!isSelectedProgram || !isFreemium) && (
            <>
              <DynamicFormattedMessage
                className={`${userDeclarationBlockTitle} ${withGrayColor}`}
                id={blockTitle}
                style={{ color: colorWidgetTitle }}
                tag={HTML_TAGS.SPAN}
              />
              {getMidContent()}
              <DynamicFormattedMessage
                tag={Link}
                to={
                  isBeneficiary
                    ? WALL_BENEFICIARY_DECLARATIONS_ROUTE
                    : isFreemium
                    ? LAUNCH_BASE
                    : USER_DECLARATIONS_ROUTE
                }
                className={userDeclarationBlockLink}
                id={linkTranslation}
                style={{ color: isWallRoute || isCommunicationRoute ? colorMainButtons : '' }}
              />
            </>
          )}
          {selectedProgram && isFreemium && (
            <>
              <div className={`${wallBaseStyle.modifyBlockContainer}`}>
                <span
                  className={`${userDeclarationBlockTitle} ${withGrayColor}`}
                  id={blockTitle}
                  style={{ color: colorWidgetTitle }}
                >
                  {blockTitle}
                </span>
                {isAnyAdmin && <div className={`${postIcon} ${modifyProgram}`} onClick={onClick} />}
              </div>

              <MediaBlock
                mediaType="image"
                showModal={false}
                setShowModal={setShowModal}
                media={{
                  url: src, //file and video
                  ext: imagExt,
                  src: src, //src for image
                  size: 100,
                  title: 'Bloc image file',
                  alt: 'Bloc image file'
                }}
              />
              <div className={`${withGrayColor}`} dangerouslySetInnerHTML={{ __html: blocDesc }} />
            </>
          )}
        </>
      )}
    </GeneralBlock>
  );
};

export default UserDeclarationsWidget;
