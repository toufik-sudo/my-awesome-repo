/* eslint-disable quotes */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import GeneralBlock from 'components/molecules/block/GeneralBlock';
import useUserNumber from 'hooks/wall/useUserNumber';
import Loading from 'components/atoms/ui/Loading';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { HTML_TAGS, IMAGES_ALT, LOADER_TYPE } from 'constants/general';
import { FREEMIUM, USERS_ROUTE } from 'constants/routes';
import { useWallSelection } from 'hooks/wall/useWallSelection';
import { useSelectedProgramDesign } from 'hooks/wall/ui/useSelectedProgramColors';
import { useWallRoute } from 'hooks/wall/useWallRoute';
import { numberWithSpaces } from 'utils/general';

import style from 'sass-boilerplate/stylesheets/components/wall/WallUserBlock.module.scss';
import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';
import wallStyle from 'sass-boilerplate/stylesheets/components/wall/WallBasePageStructure.module.scss';
import wallBaseStyle from 'sass-boilerplate/stylesheets/components/wall/WallBaseBlock.module.scss';
import { getCurrentProgramDetails } from 'services/wall/blocks';
import { WALL_BLOCK } from 'constants/wall/blocks';
import { getHtmlFromEditorBlocks, getHtmlFromEditorState } from 'services/WysiwygService';
import MediaBlock from '../postBlock/media/MediaBlock';
import postTabStyle from 'sass-boilerplate/stylesheets/components/wall/PostTabs.module.scss';
import { PROGRAM_TYPES, PROGRAM_TYPES_NAMES } from 'constants/wall/launch';
import { useUserRole } from 'hooks/user/useUserRole';
import { getUserAuthorizations, isAnyKindOfAdmin, isAnyKindOfManager, isUserBeneficiary } from 'services/security/accessServices';
import ButtonSwitch from 'components/atoms/ui/ButtonSwitch';
import useSelectedProgram from 'hooks/wall/useSelectedProgram';

/**
 * Molecule component used to render user block
 * @constructor
 */
const UserNumberWidget = ({ programDetails, modifyProgramDesign }) => {
  const selectedProgram = useSelectedProgram();
  const [showModal, setShowModal] = useState(true);
  const { userBlock, userBlockTitle, userBlockLink, userBlockCount, userBlockNumbers, userImgContainer } = style;
  const { currentProgramUsers, isLoading } = useUserNumber();
  const { colorMainButtons, colorTitle, colorWidgetTitle } = useSelectedProgramDesign();
  const { isWallRoute, isCommunicationRoute } = useWallRoute();
  const { selectedProgramIndex, selectedProgramId , programs } = useWallSelection();
  //Modify Widget blocs to pub in walls only and when a wall is selected --> not in show all programs
  const currentProgramDetails = getCurrentProgramDetails(programDetails, WALL_BLOCK.USER_BLOCK);
  const { menuTitle, pictureUrl, content, bannerTitle } = currentProgramDetails;
  const programType = programDetails?.type || PROGRAM_TYPES[FREEMIUM];
  const isFreemium = programType == PROGRAM_TYPES[FREEMIUM];
  const role = useUserRole();
  const userRights = getUserAuthorizations(role);
  const isAnyAdmin = isAnyKindOfAdmin(userRights);
  const isAnyManager = isAnyKindOfManager(userRights);
  const [isChecked, setIsChecked] = useState(false);
  const isSelectedProgram = programs?.length > 1 && selectedProgramIndex !== 0 || programs?.length == 1 ? true : false;
  let blockTitle = 'wall.user.block.user';
  let blocDesc = 'wall.user.see.all';
  let imagExt = 'jpg';
  const isAllLoaded = selectedProgramIndex == 0 ? !isLoading : !isLoading && Object.keys(programDetails).length > 0;
  if (!isSelectedProgram) {
    blockTitle = selectedProgramId ? 'wall.user.block.userUnique' : 'wall.user.block.user';
    blocDesc = 'wall.user.see.all';
  } else if (isAnyAdmin && isFreemium && isAllLoaded && isChecked) {
    console.log("let's see freemium")
    blockTitle = menuTitle;
    console.log(blockTitle)
    blocDesc = getHtmlFromEditorBlocks(content);
    imagExt = pictureUrl.substring(pictureUrl?.lastIndexOf('.') + 1) || 'jpg';
  } else {
    if(!isAnyAdmin && isFreemium && isAllLoaded ) {
      console.log("let's see freemium")
      blockTitle = menuTitle;
      console.log(blockTitle)
      blocDesc = getHtmlFromEditorBlocks(content);
      imagExt = pictureUrl.substring(pictureUrl?.lastIndexOf('.') + 1) || 'jpg';}
    else {
      blockTitle = 'wall.user.block.user';
      blocDesc = 'wall.user.see.all';
    }
  }
  //For the image
  const src = isAllLoaded ? pictureUrl : '';
  const { postIcon, modifyProgram } = postTabStyle;
  const onClick = () => {
    if(selectedProgram && selectedProgram.programType){
      const programType = PROGRAM_TYPES_NAMES[selectedProgram.programType]
      modifyProgramDesign(WALL_BLOCK.USER_BLOCK, programType);
    }
  };

 

  return (
    <GeneralBlock className={`${userBlock} ${userBlockNumbers} ${wallStyle.hideBlockMobile}`}>
      {!isAllLoaded && (
        <div className={userBlockCount}>
          <Loading className={coreStyle.withSecondaryColor} type={LOADER_TYPE.DROPZONE} />
        </div>
      )}
      {isAllLoaded && (
        <>
          {(!isSelectedProgram || !isFreemium || (!isChecked && isAnyAdmin)) && (
            <>
              {isAnyAdmin && isFreemium && isSelectedProgram && (
                <div className={`${wallBaseStyle.modifyBlockContainer}`}>
                  {isAnyAdmin && <ButtonSwitch {...{ isChecked, setIsChecked }} />}
                  <DynamicFormattedMessage
                    style={{ color: colorWidgetTitle }}
                    className={userBlockTitle}
                    id={blockTitle}
                    tag={HTML_TAGS.SPAN}
                  />
                </div>
              )}
              <p className={userBlockCount} style={{ color: isWallRoute || isCommunicationRoute ? colorTitle : '' }}>
                {numberWithSpaces(currentProgramUsers)}
              </p>
              <DynamicFormattedMessage
                tag={Link}
                to={USERS_ROUTE}
                className={userBlockLink}
                id={blocDesc}
                style={{ color: isWallRoute || isCommunicationRoute ? colorMainButtons : '' }}
              />
            </>
          )}
          {selectedProgram && isFreemium && ((isChecked && isAnyAdmin) || !isAnyAdmin) && (
            <>
              <div className={`${wallBaseStyle.modifyBlockContainer}`}>
                {isAnyAdmin && <ButtonSwitch {...{ isChecked, setIsChecked }} />}
                <span
                  className={`${userBlockTitle} ${coreStyle.withGrayColor}`}
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
              <div className={`${coreStyle.withGrayColor}`} dangerouslySetInnerHTML={{ __html: blocDesc }} />
            </>
          )}
        </>
      )}
    </GeneralBlock>
  );
};

export default UserNumberWidget;
