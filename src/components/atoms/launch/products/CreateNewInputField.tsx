import React from 'react';
import { useIntl } from 'react-intl';

import style from 'assets/style/common/Input.module.scss';
import { DEFAULT_INPUT_CHAR_LENGTH } from 'constants/general';
import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';
import { DESIGN_TITLE, DESIGN_TEXT } from 'constants/wall/launch';

/**
 * Atom component used to render create new input product field
 *
 * @param value
 * @param onChange
 * @param type
 * @param maxLength
 * @constructor
 */
const CreateNewInputField = ({ value, onChange, type, maxLength = DEFAULT_INPUT_CHAR_LENGTH }) => {
  const { formatMessage } = useIntl();
  const { container, defaultInputStyle } = style;
  const { withFontSmall, pl1, pt05, withGrayColor } = coreStyle;

  return (
    <div className={container} style={{ flexDirection: (type == DESIGN_TITLE || type == DESIGN_TEXT) && maxLength ? 'column' : 'column-reverse' }} >
      <input
        className={defaultInputStyle}
        {...{ onChange, value }}
        placeholder={formatMessage({ id: `launchProgram.field.name.${type}` })}
        maxLength={maxLength}
      />
      {(type == DESIGN_TITLE || type == DESIGN_TEXT) && maxLength && <span className={`${pl1} ${withFontSmall} ${withGrayColor} ${pt05}`}>
        {formatMessage({ id: `form.label.${type}.maxLength` }, {maxLength: maxLength})}
      </span>}
    </div>
  );
};

export default CreateNewInputField;
