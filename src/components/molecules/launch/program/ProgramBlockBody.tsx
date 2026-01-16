import React from 'react';

import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import labelsStyle from 'assets/style/common/Labels.module.scss';
import style from 'assets/style/components/BlockElement.module.scss';

/**
 * Molecule component used to render Program Block body
 *
 * @constructor
 */
const ProgramBlockBody = ({ titleId, textId }) => {
  const { blockTitle, blockDescriptionWrapper, blockTitleLarge, blockBody } = style;

  return (
    <div className={blockBody}>
      <DynamicFormattedMessage tag="p" className={`${blockTitle} ${blockTitleLarge}`} id={titleId} />
      <DynamicFormattedMessage
        tag="p"
        className={`${blockDescriptionWrapper} ${blockTitleLarge}`}
        id={textId}
        values={{
          value: <DynamicFormattedMessage tag="span" className={labelsStyle.bold} id="launchProgram.incentive" />
        }}
      />
    </div>
  );
};

export default ProgramBlockBody;
