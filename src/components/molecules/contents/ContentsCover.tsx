import React from 'react';

import ContentsBackgroundCover from 'components/organisms/launch/contents/ContentsBackgroundCover';
import { useContentPageData } from 'hooks/launch/contents/useContentPageData';
import { ContentsCoverContext } from 'components/pages/ContentsPage';

/**
 * Molecule component used to render Contents Cover
 *
 * @constructor
 */
const ContentsCover = () => {
  const { contentCoverConfig } = useContentPageData();

  return (
    <ContentsCoverContext.Provider value={contentCoverConfig}>
      <ContentsBackgroundCover />
    </ContentsCoverContext.Provider>
  );
};

export default ContentsCover;
