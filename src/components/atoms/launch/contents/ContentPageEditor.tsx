/* eslint-disable quotes */
import React, { useEffect, useRef, useState } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

import ContentsPageInfo from './ContentPageInfo';
import ContentsCoverPreview from 'components/molecules/contents/ContentsCoverPreview';
import { HTML_TAGS, MAX_WYSIWIG_LENGTH, MAX_WYSIWIG_LENGTH_PUB } from 'constants/general';
import { ContentsCoverContext } from 'components/pages/ContentsPage';

import wysiwigStyle from 'sass-boilerplate/stylesheets/components/launch/Wysiwig.module.scss';
import gridStyle from 'assets/style/common/Grid.module.scss';
import { EditorState, ContentState, convertFromHTML } from 'draft-js';
import { useWisiwigData } from 'hooks/contents/useWisiwigData';
import { FormattedMessage, useIntl } from 'react-intl';
import Button from 'components/atoms/ui/Button';
import buttonStyle from 'assets/style/common/Button.module.scss';
import style from 'assets/style/components/wall/GeneralWallStructure.module.scss';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';

/**
 * Template component used to render Contents Editor page
 *
 * @param editorState
 * @param handleEditorChange
 */
const ContentsPageEditor = ({ contentBlock, wysiwigDataParam, stepIndex, form, getEditorData }) => {
  return (
    <div className={gridStyle.col7}>
      <ContentsCoverPreview context={ContentsCoverContext} {...{ form }} />
      <ContentsPageInfo />
      <MyEditor
        contentBlock={contentBlock}
        wysiwigDataParam={wysiwigDataParam}
        stepIndex={stepIndex}
        form={form}
        getEditorData={getEditorData}
      />
    </div>
  );
};

export default ContentsPageEditor;

export function MyEditor({ contentBlock, wysiwigDataParam, stepIndex, form, getEditorData }) {
  let [editorState, setEditorState] = useState(EditorState.createEmpty());
  const { wysiwigToolbar, wysiwigWrapper, wysiwigEditor } = wysiwigStyle;
  let contentState: ContentState = null;
  contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
  const onEditorStateChange = newEditorState => {
    setEditorState(newEditorState);
    // useWisiwigData(newEditorState.getCurrentContent(), stepIndex);
  };
  getEditorData(editorState.getCurrentContent());
  const { formatMessage } = useIntl();
  const { withFontSmall, pl1, pt05, withGrayColor } = coreStyle;

  useEffect(() => {
    setEditorState(EditorState.push(editorState, contentState, 'insert-characters'));
    console.log(editorState);
    return;
  }, [contentBlock]);

  const editor = useRef(null);

  useEffect(() => {
    // focusEditor()
  }, []);
  const wysiwigLength = editorState
    .getCurrentContent()
    .getPlainText('')
    .trim().length;
  let isDisabled = false;
  let maxLengthTxt = MAX_WYSIWIG_LENGTH;
  if (stepIndex == '1') {
    isDisabled = !(wysiwigLength && form.values.contentsTitle?.trim());
  } else {
    const indexConst = (stepIndex - 1).toString();
    isDisabled = !(wysiwigLength && form.values['contentsTitle' + indexConst]?.trim());
    maxLengthTxt = MAX_WYSIWIG_LENGTH_PUB;
  }

  // const getEditorData = ()=>{
  //   return editorData;
  // }

  return (
    <>
      <Editor
        ref={editor}
        editorState={editorState}
        toolbarClassName={wysiwigToolbar}
        wrapperClassName={wysiwigWrapper}
        editorClassName={wysiwigEditor}
        onEditorStateChange={onEditorStateChange}
        toolbar={{
          options: [
            'inline',
            'blockType',
            'fontSize',
            'fontFamily',
            'list',
            'textAlign',
            'colorPicker',
            'link',
            'emoji',
            'image',
            'history'
          ]
        }}
        handleBeforeInput={() => {
          if (wysiwigLength >= maxLengthTxt) {
            return 'handled';
          }
        }}
        handlePastedText={val => val.length + wysiwigLength >= maxLengthTxt}
      />
      <div style={{ marginBottom: "3rem", textAlign: "center" }} className={`${pl1} ${withFontSmall} ${withGrayColor} ${pt05}`}>
        {formatMessage({ id: `launch.wysiwig.max.length` }, { maxLength: maxLengthTxt })}
      </div>

      <div className={style.alignCenterOnDesktop}>
        <Button role="submit" loading={form.isSubmitting} className={`${isDisabled && buttonStyle.disabled}`}>
          <FormattedMessage id="form.submit.next" />
        </Button>
      </div>
    </>
  );
}
