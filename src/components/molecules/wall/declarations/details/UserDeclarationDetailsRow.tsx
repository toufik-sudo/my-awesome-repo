import React from 'react';

import { INPUT_TYPE } from 'constants/forms';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { HTML_TAGS } from 'constants/general';
import { LINK_TARGET } from 'constants/ui';

import componentStyle from 'sass-boilerplate/stylesheets/components/wall/UsersDeclarationDetail.module.scss';
import inputStyle from 'assets/style/common/Input.module.scss';
import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';
import eCardStyle from 'sass-boilerplate/stylesheets/components/launch/Ecard.module.scss';
import TextInput from 'components/atoms/ui/TextInput';

/**
 * Molecule component used to render user declaration detail form row
 * @param label
 * @param placeholder
 * @param type
 * @param link
 * @param className
 * @param disabled
 * @param labelValues
 * @param value
 * @param style
 * @param isTextArea
 * @constructor
 */
const UserDeclarationDetailRow = ({
  label,
  type,
  placeholder = '',
  value = '',
  link = '',
  className = '',
  disabled = false,
  labelValues = {},
  style = undefined,
  isTextArea = false
}) => {
  const { userDeclarationsDetailRow, userDeclarationsDetailInputWrapper, userDeclarationsDetailLink } = componentStyle;
  const { defaultInputStyle, container, isDisabled, textareaUserDeclaration } = inputStyle;
  const isTimeField = style && style.timeField;

  return (
    <div className={`${userDeclarationsDetailRow} ${className}`}>
      {label && (
        <DynamicFormattedMessage tag={HTML_TAGS.LABEL} id={label} className={coreStyle.pr1} values={labelValues} />
      )}
      {type === HTML_TAGS.ANCHOR ? (
        <a href={link} target={LINK_TARGET.BLANK} rel="noopener noreferrer" className={userDeclarationsDetailLink}>
          {value}
        </a>
      ) : isTextArea ? (
        <div className={`${container} ${userDeclarationsDetailInputWrapper} ${disabled ? isDisabled : ''}`}>
          <textarea
            className={`${defaultInputStyle} ${textareaUserDeclaration}`}
            defaultValue={value}
            readOnly={disabled}
            placeholder={placeholder}
            required
          />
        </div>
      ) : (
        <div className={`${container} ${userDeclarationsDetailInputWrapper} `}>
          {/* <input
            type={isTimeField ? INPUT_TYPE.TIME : type}
            className={defaultInputStyle}
            defaultValue={value}
            readOnly={disabled}
            placeholder={placeholder}
            required
          /> */}
          <TextInput
            value={value || ""}
            disabled={true}
            onChange={() => { }}
            wrapperClass={`${inputStyle.container} ${inputStyle.floating} ${eCardStyle.customTextInputUser}`}
            hasLabel={false}
            labelId={label}
          />

        </div>
      )}
    </div>
  );
};

export default UserDeclarationDetailRow;
