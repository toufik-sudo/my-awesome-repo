import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faEdit } from '@fortawesome/free-solid-svg-icons';

import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { HTML_TAGS } from 'constants/general';

import style from 'sass-boilerplate/stylesheets/components/launch/Cube.module.scss';
import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';
import eCardStyle from 'sass-boilerplate/stylesheets/components/launch/Ecard.module.scss';
import FlexibleModalContainer from 'containers/FlexibleModalContainer';
import UploadUserGrowthRef from 'components/organisms/declarations/upload/UploadUserGrowthRef';

/**
 * Atom component used to render validate cta
 *
 * @param targetName
 * @param targetValue
 * @param handleItemValidation
 * @constructor
 */
const ValidateGrowthCta = ({ targetName = '', targetValue, handleItemValidation, goalIndex }) => {
  const [isGrowthRefLoaded, setIsGrowthRefLoaded] = useState(false);
  const [openGrowthRefModal, setOpenGrowthRefModal] = useState(false);

  const showUploadGrowthRefModal = () => {
    setOpenGrowthRefModal(true);
    // setIsGrowthRefLoaded(true);
  }

  const closeModal = () => {
    setOpenGrowthRefModal(false);
  }

  return (
    <div className={`${style.cubeValidateButton} ${targetValue ? style.cubeValidateButtonSelected : ''}`}>
      <FlexibleModalContainer
        fullOnMobile={false}
        className={`${style.mediaModal} ${eCardStyle.customModal} ${eCardStyle.customValidateModal}`}
        closeModal={() => closeModal}
        isModalOpen={openGrowthRefModal}
      >
        <div className={style.mediaModalContent}>        
          <UploadUserGrowthRef index={goalIndex} setIsGrowthRefLoaded={setIsGrowthRefLoaded} closeModal={closeModal}/>   
        </div>
      </FlexibleModalContainer>
      {targetName == "allocationType" &&
        <span>
          <button onClick={showUploadGrowthRefModal}>
            <FontAwesomeIcon icon={targetValue ? faEdit : faCheck} />
            <DynamicFormattedMessage
              tag={HTML_TAGS.SPAN}
              id={`launchProgram.cube.addGrowthRef`}
            />
          </button>
        </span>
      }
      <span className={!isGrowthRefLoaded ? coreStyle.disabled : ""} onClick={() => { if (isGrowthRefLoaded) handleItemValidation(targetName) }} >
        <FontAwesomeIcon icon={targetValue ? faEdit : faCheck} />
        <DynamicFormattedMessage tag={HTML_TAGS.SPAN} id={`launchProgram.cube.${targetValue ? 'modify' : 'validate'}`} />
      </span>
    </div>
  )
};

export default ValidateGrowthCta;
