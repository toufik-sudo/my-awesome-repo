import React from 'react';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import GeneralBlock from 'components/molecules/block/GeneralBlock';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { HTML_TAGS } from 'constants/general';

import grid from 'sass-boilerplate/stylesheets/vendors/bootstrap-grid.module.scss';
import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';
import block from 'sass-boilerplate/stylesheets/components/block/Block.module.scss';

import { useIntl } from 'react-intl';
import { toast } from 'react-toastify';

const ProgramCreate = ({ disabled, onClick, id, background }) => {
  const {
    withBackgroundImage,
    mt0,
    withDefaultColor,
    top50,
    left0,
    right0,
    mb2,
    cardTitleLg,
    flex,
    pointer,
    opacity04,
    mb3
  } = coreStyle;

  const { disabledPlatform } = block;
  const { formatMessage } = useIntl();

  let blockStyle = pointer;
  if (disabled) {
    blockStyle = `${disabledPlatform}`;
  }
  const displayBlockedMsg = ()=>{
    toast(formatMessage({ id: 'create.blocked.platform' }));
  }

  return (
    <GeneralBlock
      isShadow={false}
      className={`${background} ${withBackgroundImage} ${blockStyle} ${mt0} ${grid['position-relative']} ${mb3}`}
      handleClick={disabled ? displayBlockedMsg : onClick}
    >
      <div
        className={`${withDefaultColor} ${blockStyle} ${top50} ${left0} ${right0} ${grid['position-absolute']} ${grid['align-items-center']} ${flex} ${coreStyle['flex-direction-column']}`}
      >
        <FontAwesomeIcon icon={faPlus} className={`${cardTitleLg} ${mb2} `} />
        <DynamicFormattedMessage tag={HTML_TAGS.SPAN} id={id} />
      </div>
      
    </GeneralBlock>
  );
};

export default ProgramCreate;

