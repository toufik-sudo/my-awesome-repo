import React from 'react';
import ReactTooltip from 'react-tooltip';

import ErrorLineDisplay from 'components/atoms/ui/ErrorLineDisplay';
import { TOOLTIP_FIELDS } from 'constants/tootltip';

import style from 'assets/style/components/launch/UserListErrorDisplay.module.scss';

/**
 * Molecule component used to display error list
 *
 * @param invalidRecords
 * @constructor
 */
const ErrorList = ({ invalidRecords }) => {
  return (
    <ul className={style.errorsDisplayList}>
      {invalidRecords &&
        invalidRecords.map(({ email, errors: { code } }, index) => (
          <ErrorLineDisplay key={index} {...{ email, code }} />
        ))}
      <ReactTooltip
        place={TOOLTIP_FIELDS.PLACE_BOTTOM}
        type={TOOLTIP_FIELDS.TYPE_ERROR}
        effect={TOOLTIP_FIELDS.EFFECT_SOLID}
      />
    </ul>
  );
};

export default ErrorList;
