/* eslint-disable quotes */
import React, { useMemo, useState } from 'react';

import GenericFormBuilder from 'components/organisms/form-wrappers/GenericFormBuilder';
import ContentFormAdditional from 'components/molecules/forms/contents/ContentFormAdditional';
import ContentsBackgroundCover from 'components/organisms/launch/contents/ContentsBackgroundCover';
import { contentsPageParametersAction } from 'store/actions/formActions';
import { useContentData } from 'hooks/contents/useContentData';
import { useContentsImages } from 'hooks/contents/useContentsImages';

import style from 'assets/style/components/wall/GeneralWallStructure.module.scss';
import gridStyle from 'assets/style/common/Grid.module.scss';
import contentsStyle from 'assets/style/components/launch/Contents.module.scss';
import ContentsPageEditor from 'components/atoms/launch/contents/ContentPageEditor';
import { EditorState, ContentState, convertFromHTML } from 'draft-js';
/**
 * Organism component used to render Contents Wrapper page
 *
 * @constructor
 */
const ContentsPageWrapperForm = ({ stepIndex }) => {
  const { accentLabels, containerSmall, alignCenterOnDesktop } = style;
  const { col12, col4, containerLarge } = gridStyle;
  const { formFields, contentBlock, wysiwigDataParam, dispatch, setNextStep } = useContentData();
  let editorData1 = null;
  // function onEditorChange(newEditorData){
  //   setEditorData(newEditorData);
  // }
  const memo = useMemo(() => {
    return editorData1;
  }, [editorData1]);

  const getEditorData = editorData => {
    editorData1 = editorData;
  };

  const coverContext = useContentsImages();
  const formAction = (values, props) => {
    contentsPageParametersAction(values, dispatch, setNextStep, editorData1, coverContext, stepIndex, props);
  };
  return (
    <div className={`${col12} ${containerLarge}`}>
      <div className={`${containerSmall} ${accentLabels}`}>
        <GenericFormBuilder
          formAction={formAction}
          formDeclaration={formFields}
          classname={`${col4} ${contentsStyle.contentsInputsWrapper}`}
          formClassName={col12}
          insideFormSlot={<ContentsBackgroundCover />}
          formSlot={form => (
            <>
              <ContentsPageEditor {...{ contentBlock, wysiwigDataParam, stepIndex, form, getEditorData }} />              
              <div className={alignCenterOnDesktop}>{/*<ContentButton {...{ wysiwigLength, form }} />*/}</div>
            </>
          )}
        />
      </div>
    </div>
  );
};

export default ContentsPageWrapperForm;
