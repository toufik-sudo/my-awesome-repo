import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapPin } from '@fortawesome/free-solid-svg-icons';

import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';

import style from 'sass-boilerplate/stylesheets/components/wall/WallPostBaseBlock.module.scss';
import iconStyle from 'sass-boilerplate/stylesheets/layout/Icon.module.scss';

/**
 * Molecule component used to render create Post Actions Pin
 *
 * @setisPinned
 * @isPinned
 * @constructor
 */
const CreatePostPin = ({ setIsPinned, isPinned }) => {
  const { wallPostActionBlock, wallPostPinned } = style;
  const { iconIsActive, icon } = iconStyle;
  const [isActive, setisActive] = useState(false);

  const handlePinClick = () => {
    setIsPinned(!isPinned);
    setisActive(true);
    setTimeout(() => setisActive(false), 400);
  };

  return (
    <div
      className={`${wallPostActionBlock} ${!isPinned || wallPostPinned} ${icon} ${isActive ? iconIsActive : ''}`}
      onClick={() => handlePinClick()}
    >
      <FontAwesomeIcon icon={faMapPin} />
      {isPinned ? (
        <DynamicFormattedMessage tag="span" id="launchProgram.wall.pined" />
      ) : (
        <DynamicFormattedMessage tag="span" id="launchProgram.wall.pin" />
      )}
    </div>
  );
};

export default CreatePostPin;
