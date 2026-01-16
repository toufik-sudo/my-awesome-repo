import { useEffect } from 'react';

import { useSelector } from 'react-redux';
import { IStore } from 'interfaces/store/IStore';

/**
 * Hook used to get all information on Create Post Data
 */
const useTitleContentData = (titleState, contentState) => {
  const [title, setTitle] = titleState;
  const [content, setContent] = contentState;

  const {
    identificationTitle: storeIdentificationTitle,
    identificationText: storeIdentificationTextTitle
  } = useSelector((store: IStore) => store.launchReducer);

  useEffect(() => {
    if (storeIdentificationTitle) setTitle(storeIdentificationTitle);
    if (storeIdentificationTextTitle) setContent(storeIdentificationTextTitle);
  }, [storeIdentificationTitle, storeIdentificationTextTitle]);

  return { title, setTitle, content, setContent };
};

export default useTitleContentData;
