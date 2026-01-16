import React from 'react';

import Button from 'components/atoms/ui/Button';
import { BUTTON_MAIN_TYPE } from 'constants/ui';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { useTypeConfidentialityControl } from 'hooks/launch/program/useTypeConfidentialityControl';

/**
 * Molecule component used to render program block button control
 *
 * @param className
 * @param textId
 * @param titleId
 * @constructor
 *
 * NOTE: no story needed as it is only a dynamic formatted message with a hook
 */
const ProgramBlockButtonControl = ({ className, textId, titleId }) => {
  const { addSelection } = useTypeConfidentialityControl(textId);

  return (
    <DynamicFormattedMessage
      key={textId}
      type={className}
      disabled={className === BUTTON_MAIN_TYPE.DISABLED}
      tag={Button}
      onClick={() => addSelection(titleId)}
      id={textId}
    />
  );
};

export default ProgramBlockButtonControl;
