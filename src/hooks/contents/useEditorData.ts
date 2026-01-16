/* eslint-disable quotes */
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
// import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
// import { EditorState, ContentState, convertFromHTML, Modifier } from 'draft-js';

import { IStore } from 'interfaces/store/IStore';
// import { useWisiwigData } from './useWisiwigData';

/**
 * Hook used to handle Editor data from Contents page in order to retreive wysiwig data
 *
 */
export const useEditorData = stepIndex => {
  const { wysiwigDataField } = useSelector((store: IStore) => store.launchReducer);
  const { wysiwigDataField1 } = useSelector((store: IStore) => store.launchReducer);
  const { wysiwigDataField2 } = useSelector((store: IStore) => store.launchReducer);
  const { wysiwigDataField3 } = useSelector((store: IStore) => store.launchReducer);
  const { wysiwigDataField4 } = useSelector((store: IStore) => store.launchReducer);
  let contentBlock = htmlToDraft('');
  let wysiwigDataParam = null;
  if (stepIndex == '1') {
    wysiwigDataParam = wysiwigDataField;
  } else if (stepIndex == '2') {
    wysiwigDataParam = wysiwigDataField1;
  } else if (stepIndex == '3') {
    wysiwigDataParam = wysiwigDataField2;
  } else if (stepIndex == '4') {
    wysiwigDataParam = wysiwigDataField3;
  } else if (stepIndex == '5') {
    wysiwigDataParam = wysiwigDataField4;
  }
  if (!wysiwigDataParam || wysiwigDataParam == '') {
    wysiwigDataParam =
      '{"blocks":[{"key":"cr61g","text":"","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}';
  }

  contentBlock = htmlToDraft(draftToHtml(JSON.parse(wysiwigDataParam)));
  // console.log("stepIndex : " + stepIndex);
  // console.log(contentBlock);

  return {
    contentBlock,
    wysiwigDataParam
  };
};
