import React from 'react';

import CreatePostBlock from 'components/molecules/wall/postBlock/CreatePostBlock';
import PostsSummaryMessage from 'components/atoms/wall/PostsSummaryMessage';
import IntroductionBlock from 'components/organisms/wall/beneficiary/IntroductionBlock';
import { useWallSelection } from 'hooks/wall/useWallSelection';
import { isUserBeneficiary } from 'services/security/accessServices';

/**
 * Wrapper for post creation and post list
 *
 * @constructor
 */
const PostListHeader = () => {
  const {
    selectedProgramId,
    selectedPlatform: { role }
  } = useWallSelection();
  const isBeneficiary = isUserBeneficiary(role);
  if (isBeneficiary) {
    return <IntroductionBlock />;
  }

  if (selectedProgramId) {
    return <CreatePostBlock />;
  }

  return <PostsSummaryMessage />;
};

export default PostListHeader;
