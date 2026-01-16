import { useSelector, useDispatch } from 'react-redux';

import { buildContentsFormField } from 'services/LaunchServices';
import { IStore } from 'interfaces/store/IStore';
import { useEditorData } from './useEditorData';
import { useMultiStep } from 'hooks/launch/useMultiStep';
import { useParams } from 'react-router-dom';
import { FORM_FIELDS } from 'constants/forms';

/**
 * Hook used to handle Content data from Contents page in order to create Form
 *
 */
export const useContentData = () => {
  const { step, stepIndex } = useParams();
  const dispatch = useDispatch();
  const {
    stepSet: { setNextStep }
  } = useMultiStep();
  const { contentsTitle, bannerTitle } = useSelector(
    (store: IStore) => 
    store.launchReducer
  );
  const { contentsTitle1, bannerTitle1 } = useSelector(
    (store: IStore) => 
    store.launchReducer
  );
  const { contentsTitle2, bannerTitle2 } = useSelector(
    (store: IStore) => 
    store.launchReducer
  );
  const { contentsTitle3, bannerTitle3 } = useSelector(
    (store: IStore) => 
    store.launchReducer
  );
  const { contentsTitle4, bannerTitle4 } = useSelector(
    (store: IStore) => 
    store.launchReducer
  );
  let formFields = null;
  let contentsTitleParam = null;
  let bannerTitleParam = null;
  let labelTitle = '';
  let labelBanner = '';
  if (stepIndex == '1') {
    contentsTitleParam = contentsTitle;
    bannerTitleParam = bannerTitle;
    labelTitle = FORM_FIELDS.CONTENTS_TITLE;
    labelBanner = FORM_FIELDS.BANNER_TITLE;
    formFields = buildContentsFormField({ contentsTitleParam, bannerTitleParam, labelTitle, labelBanner });
  }  else {
    const indexConst = (stepIndex - 1).toString();
    labelTitle = FORM_FIELDS.CONTENTS_TITLE + indexConst;
    labelBanner = FORM_FIELDS.BANNER_TITLE + indexConst;
    switch (indexConst) {
      case '1':
        contentsTitleParam = contentsTitle1;
        bannerTitleParam = bannerTitle1;
        break;
      case '2':
        contentsTitleParam = contentsTitle2;
        bannerTitleParam = bannerTitle2;
        break;
      case '3':
        contentsTitleParam = contentsTitle3;
        bannerTitleParam = bannerTitle3;
        break;
      case '4':
        contentsTitleParam = contentsTitle4;
        bannerTitleParam = bannerTitle4;
        break;
    
      default:
        break;
    }
    
    formFields = buildContentsFormField({ contentsTitleParam, bannerTitleParam, labelTitle, labelBanner });
  }
   
  const { contentBlock, wysiwigDataParam, } = useEditorData(stepIndex);
  const contentGeneralData = { contentBlock, dispatch, setNextStep };

  return {
    formFields,
    dispatch,
    setNextStep,
    contentBlock, 
    wysiwigDataParam
  };
};
