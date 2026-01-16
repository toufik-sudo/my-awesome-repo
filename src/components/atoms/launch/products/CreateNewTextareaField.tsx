import { DESIGN_TEXT, DESIGN_TITLE } from 'constants/wall/launch';
import React from 'react';
import { useIntl } from 'react-intl';

import style from 'sass-boilerplate/stylesheets/pages/DesignIdentification.module.scss';
import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';

/**
 * Atom component used to render create new textarea field
 *
 * @param value
 * @param onChange
 * @param type
 * @param customClass
 * @constructor
 */
const CreateNewTextareaField = ({ value, onChange, type, customClass = style.designTextarea, maxLength = null }) => {
  const { formatMessage } = useIntl();
  const { withFontSmall, pl1, pt05, withGrayColor } = coreStyle;

  return (
    <>
      <textarea
        className={customClass}
        {...{ onChange, value }}
        placeholder={formatMessage({ id: `launchProgram.field.name.${type}` })}
      />
      {(type == DESIGN_TITLE || type == DESIGN_TEXT) && maxLength && <div className={`${pl1} ${withFontSmall} ${withGrayColor} ${pt05}`}>
        {formatMessage({ id: `form.label.${type}.maxLength` }, { maxLength: maxLength })}
      </div>}
    </>
  );
};

export default CreateNewTextareaField;
