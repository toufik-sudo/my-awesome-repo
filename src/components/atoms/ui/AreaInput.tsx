import React from 'react';

import { HTML_TAGS } from 'constants/general';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';

import componentStyle from 'sass-boilerplate/stylesheets/components/communication/CreateCampaignList.module.scss';
import errorStyle from 'assets/style/common/Input.module.scss';

/**
 * Renders a textarea input with error handling
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
const AreaInput = ({
  value,
  onChange,
  disabled = false,
  error = null,
  placeholder = '',
  errorId = '',
  wrapperClass = '',
  inputClass = componentStyle.createCampaignInput,
  hasLabel = false,
  labelId = ''
}) => (
  <div className={`${wrapperClass} ${hasLabel && value ? errorStyle.hasValue : ''}`}>
    {hasLabel && <DynamicFormattedMessage tag={HTML_TAGS.LABEL} id={labelId} />}
    <textarea
      className={inputClass}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      rows={4} 
    />
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

export default AreaInput;
