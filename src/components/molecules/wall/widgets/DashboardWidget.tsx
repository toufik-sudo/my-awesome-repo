/* eslint-disable quotes */
/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import GeneralBlock from 'components/molecules/block/GeneralBlock';
import Loading from 'components/atoms/ui/Loading';
import useDashboardNumber from 'hooks/wall/useDashboardNumber';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { HTML_TAGS, LOADER_TYPE } from 'constants/general';
import { DASHBOARD_ROUTE, LAUNCH_BASE, WALL_BENEFICIARY_POINTS_ROUTE } from 'constants/routes';
import { useSelectedProgramDesign } from 'hooks/wall/ui/useSelectedProgramColors';
import { useWallRoute } from 'hooks/wall/useWallRoute';
import { numberWithSpaces } from 'utils/general';

import style from 'sass-boilerplate/stylesheets/components/wall/WallUserBlock.module.scss';
import wallStyle from 'sass-boilerplate/stylesheets/components/wall/WallBasePageStructure.module.scss';
import wallBaseStyle from 'sass-boilerplate/stylesheets/components/wall/WallBaseBlock.module.scss';
import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';
import useSelectedProgram from '../../../../hooks/wall/useSelectedProgram';
import { FREEMIUM, PROGRAM_TYPES, PROGRAM_TYPES_NAMES } from '../../../../constants/wall/launch';
import { useUserRole } from '../../../../hooks/user/useUserRole';
import { getUserAuthorizations, isAnyKindOfAdmin, isAnyKindOfManager } from '../../../../services/security/accessServices';
import { getCurrentProgramDetails } from 'services/wall/blocks';
import { WALL_BLOCK } from 'constants/wall/blocks';
import { useWallSelection } from 'hooks/wall/useWallSelection';
import { getHtmlFromEditorBlocks } from 'services/WysiwygService';
import MediaBlock from '../postBlock/media/MediaBlock';
import postTabStyle from 'sass-boilerplate/stylesheets/components/wall/PostTabs.module.scss';

/**
 * Molecule component used to render dashboard block
 * @constructor
 */
const DashboardWidget = ({programDetails, modifyProgramDesign}) => {
  const { userBlock, userBlockTitle, userBlockLink, userBlockCount, userBlockMatrix, userBlockNumbers } = style;
  const { overlayBeforeWhite, withSecondaryColor } = coreStyle;
  const { points, isBeneficiary, isPointsComponentLoading } = useDashboardNumber();
  const { colorMainButtons, colorTitle, colorWidgetTitle } = useSelectedProgramDesign();
  const { isWallRoute, isCommunicationRoute } = useWallRoute();
  const selectedProgram = useSelectedProgram();
  const userRole = useUserRole();
  const userAccess = getUserAuthorizations(userRole);
  const isManager = isAnyKindOfManager(userAccess);
  const isFreemium = selectedProgram && selectedProgram.programType === PROGRAM_TYPES[FREEMIUM];
  //Modify Widget blocs to pub in walls only and when a wall is selected --> not in show all programs
  const currentProgramDetails = getCurrentProgramDetails(programDetails, WALL_BLOCK.POINTS_BLOCK);
  const { menuTitle, pictureUrl, content, bannerTitle } = currentProgramDetails;
  const { selectedProgramIndex, selectedProgramId, programs } = useWallSelection();
  const [ showModal, setShowModal ] = useState(true);
  const programType = programDetails?.type || PROGRAM_TYPES[FREEMIUM];
  const isAllLoaded = selectedProgramIndex == 0 ? !isPointsComponentLoading : !isPointsComponentLoading && (Object.keys(programDetails).length > 0);
  const role = useUserRole();
  const isSelectedProgram = programs?.length > 1 && selectedProgramIndex !== 0 || programs?.length == 1 ? true : false;
  const userRights = getUserAuthorizations(role);
  const isAnyAdmin = isAnyKindOfAdmin(userRights);
  const isAnyManager = isAnyKindOfManager(userRights);
  let blockTitle = 'wall.dashboard.block.points.adminAndManager',
    linkToId = 'wall.see.all.matrix',
    route = DASHBOARD_ROUTE;
  let value = isFreemium ? 0 : numberWithSpaces(points);
  if (isBeneficiary) {
    blockTitle = 'wall.dashboard.block.points.beneficiary';
    linkToId = 'wall.see.all.points';
    route = WALL_BENEFICIARY_POINTS_ROUTE;
  } else {
    if (isFreemium && !isManager) {
      blockTitle = 'wall.dashboard.block.points.beneficiary';
      linkToId = 'wall.freemium.launch';
      route = LAUNCH_BASE;
      value = (
        <DynamicFormattedMessage
        style={{ textTransform: 'uppercase' }}
        id="wall.dashboard.block.freemium.start"
        tag={HTML_TAGS.SPAN}
        />
        );
      }
    }
    
  //Add Bloc title and desc for social wall  --> freemium
  let blocDesc = "wall.user.see.all";
  let imagExt = 'jpg';
  if (isSelectedProgram && isFreemium && isAllLoaded) {
    blockTitle = menuTitle;
    blocDesc = getHtmlFromEditorBlocks(content);
    imagExt = pictureUrl.substring(pictureUrl?.lastIndexOf('.') + 1) || 'jpg';
  }
  //For the image 
  const src = isAllLoaded ? pictureUrl : '';
  const { postIcon, modifyProgram } = postTabStyle;
  const onClick = () => {
    if(selectedProgram && selectedProgram.programType){
      const programType = PROGRAM_TYPES_NAMES[selectedProgram.programType]
      modifyProgramDesign(WALL_BLOCK.POINTS_BLOCK, programType);
    }
  };

  return (
    <GeneralBlock
      tooltipId="disabledWidget"
      className={`${userBlock} ${userBlockNumbers} }
       ${!isBeneficiary && userBlockMatrix} ${wallStyle.hideBlockMobile}`}
    >

      {
        (!isAllLoaded &&
        <div className={userBlockCount}>
            <Loading className={coreStyle.withSecondaryColor} type={LOADER_TYPE.DROPZONE} />
          </div>
        )

      }
      {
        isAllLoaded &&
          <>
            {
              (!isSelectedProgram || !isFreemium)  &&
              <>
                <DynamicFormattedMessage
                  style={{ color: colorWidgetTitle }}
                  className={userBlockTitle}
                  id={blockTitle}
                  tag={HTML_TAGS.SPAN}
                />
                <p className={userBlockCount} style={{ color: isWallRoute || isCommunicationRoute ? colorTitle : '' }}>
                  {value}
                </p>
                <DynamicFormattedMessage
                  tag={Link}
                  to={route}
                  className={userBlockLink}
                  id={linkToId}
                  style={{ color: isWallRoute || isCommunicationRoute ? colorMainButtons : '' }}
                />
              </>
            }
            {
              ( (isSelectedProgram && isFreemium) &&
                <>
                <div className={`${wallBaseStyle.modifyBlockContainer}`}>
                    <span className={`${userBlockTitle}`} id={blockTitle} style={{ color: colorWidgetTitle }}>{blockTitle}</span>
                    { isAnyAdmin && <div className={`${postIcon} ${modifyProgram}` } onClick={onClick}/>}
                    
                  </div>
                
                  <MediaBlock
                    mediaType='image'
                    showModal={false}
                    setShowModal={setShowModal}
                    media={{
                      url: src, //file and video
                      ext: imagExt,
                      src: src, //src for image
                      size: 100,
                      title: "Bloc image file",
                      alt: "Bloc image file"
                    }}
                  />
              <div className={`${coreStyle.withGrayColor} ${coreStyle.withUderline}`} dangerouslySetInnerHTML={{ __html: blocDesc }} />
                </>
              )
            }
          </>
      }
    </GeneralBlock>
  );
};

export default DashboardWidget;
