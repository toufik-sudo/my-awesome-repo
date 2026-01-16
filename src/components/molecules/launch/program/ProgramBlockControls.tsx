import React from 'react';

import ProgramBlockButtonControl from 'components/molecules/launch/program/ProgramBlockButtonControl';
import style from 'assets/style/components/BlockElement.module.scss';

/**
 * Molecule component used to render the image and buttons for Program Block
 *
 * @constructor
 */
const ProgramBlockControls = ({ index, buttons, imgFile, titleId, programType }) => {
  const { blockDescriptionImgWrapper, blockBtnWrapper } = style;
  const imagePath = programType ? imgFile : `${imgFile}${index + 1}`;

  return (
    <div
      className={blockDescriptionImgWrapper}
      style={{ backgroundImage: `url(${require(`assets/images/${imagePath}.jpg`)})` }}
    >
      <div className={blockBtnWrapper}>
        {buttons.map(({ className, textId }) => (
          <ProgramBlockButtonControl key={textId} {...{ className, textId, titleId }} />
        ))}
      </div>
    </div>
  );
};

export default ProgramBlockControls;
