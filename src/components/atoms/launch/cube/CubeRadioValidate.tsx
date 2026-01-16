import React from 'react';

import ValidateCta from 'components/atoms/launch/cube/ValidateCTA';

/**
 * Atom component used to render cube radio validate button
 *
 * @param action
 * @param payload
 * @param type
 * @constructor
 */
const CubeRadioValidate = ({ action, payload, type }) => (
  <ValidateCta
    {...{
      handleItemValidation: () => action(payload),
      targetValue: type
    }}
  />
);

export default CubeRadioValidate;
