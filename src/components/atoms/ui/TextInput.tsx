import React from 'react';

import { HTML_TAGS } from 'constants/general';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';

import componentStyle from 'sass-boilerplate/stylesheets/components/communication/CreateCampaignList.module.scss';
import errorStyle from 'assets/style/common/Input.module.scss';

/**
 * Renders a text input with error handling
 *
 * @param value
 * @param disabled
 * @param onChange
 * @param placeholder
 * @param error
 * @param errorId
 * @param wrapperClass
 * @param inputClass
 * @param hasLabel
 * @param labelId
 * @constructor
 */
const TextInput = ({
  value,
  onChange,
  disabled = false,
  error = null,
  placeholder = '',
  errorId = '',
  wrapperClass = '',
  inputClass = componentStyle.createCampaignInput,
  hasLabel = false,
  labelId = '',
  onBlur = null,
  onFocus = null,
}) => (
  <div className={`${wrapperClass} ${hasLabel && value ? errorStyle.hasValue : ''}`}>
    {hasLabel && <DynamicFormattedMessage tag={HTML_TAGS.LABEL} id={labelId} />}
    <input {...{ className: inputClass, value, onChange, placeholder, disabled, onBlur, onFocus }} />
    {error && (
      <DynamicFormattedMessage
        className={errorStyle.errorRelative}
        tag={HTML_TAGS.P}
        id={errorId || error}
        defaultMessage={error}
      />
    )}
  </div>
);

export default TextInput;
