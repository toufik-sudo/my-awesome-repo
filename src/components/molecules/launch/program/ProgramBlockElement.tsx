import React from 'react';

import ProgramBlockBody from 'components/molecules/launch/program/ProgramBlockBody';
import ProgramBlockControls from 'components/molecules/launch/program/ProgramBlockControls';
import style from 'assets/style/components/BlockElement.module.scss';

/**
 * Molecule component used to Create a new program
 *
 * @constructor
 */
const ProgramBlockElement = ({ titleId, textId, index, buttons, imgFile, programType }) => {
  const { block, blockProgram, blockWithShadow } = style;

  return (
    <div className={`${block} ${blockWithShadow} ${blockProgram}`}>
      <ProgramBlockBody {...{ titleId, textId }} />
      <ProgramBlockControls {...{ buttons, imgFile, index, titleId, programType }} />
    </div>
  );
};

export default ProgramBlockElement;
