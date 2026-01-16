import React from 'react';
import { Editor } from 'react-draft-wysiwyg';

import { WYSIWYG_TOOLBAR_OPTIONS } from 'constants/communications/campaign';
import { emptyFn } from 'utils/general';
import { HTML_TAGS } from 'constants/general';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';

import wysiwigStyle from 'sass-boilerplate/stylesheets/components/launch/Wysiwig.module.scss';
import errorStyle from 'assets/style/common/Input.module.scss';

/**
 * Renders a wysiwyg text editor
 *
 * @param editorState
 * @param onEditorStateChange
 * @param error
 * @param errorId
 * @param handleBeforeInput
 * @param handlePastedText
 * @param disabled
 * @param rest
 * @constructor
 */
const TextWysiwyg = ({
  editorState,
  onEditorStateChange,
  error = null,
  errorId = '',
  handleBeforeInput = emptyFn,
  handlePastedText = emptyFn,
  disabled = false,
  ...rest
}) => {
  const { wysiwigToolbar, wysiwigWrapper, wysiwigEditor } = wysiwigStyle;

  return (
    <>
      <Editor
        editorState={editorState}
        readOnly={disabled}
        toolbarClassName={wysiwigToolbar}
        wrapperClassName={wysiwigWrapper}
        editorClassName={wysiwigEditor}
        onEditorStateChange={onEditorStateChange}
        toolbar={{
          options: WYSIWYG_TOOLBAR_OPTIONS
        }}
        handleBeforeInput={handleBeforeInput}
        handlePastedText={handlePastedText}
        {...rest}
      />
      {error && <DynamicFormattedMessage className={errorStyle.errorRelative} tag={HTML_TAGS.P} id={errorId} />}
    </>
  );
};

export default TextWysiwyg;
