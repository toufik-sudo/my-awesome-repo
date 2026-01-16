import React, { createContext, useState } from 'react';

import SinglePostWall from 'components/molecules/wall/posts/SinglePostWall';
import PostListWrapper from 'components/molecules/wall/posts/PostListWrapper';
import SpecificUsersModal from 'components/organisms/modals/SpecificUsersModal';
import { useWallSelection } from 'hooks/wall/useWallSelection';
import { emptyFn } from 'utils/general';

export const PostListContext = createContext(null);
export const SpecificUsersContext = createContext(null);

/**
 * Molecule component used to render base wall block
 *
 * @constructor
 */
const WallBaseBlock = () => {
  const { postId } = useWallSelection().redirectData;
  const [isOpen, setIsOpen] = useState(false);
  const [specificUsersModalData, setSpecificUsersModalData] = useState({
    programId: undefined,
    postId: null,
    notifyNewSpecificUsers: emptyFn
  });
  const [reloadPostsKey, setReloadPostsKey] = useState(0);
  const openSpecificUsersModal = async (programId, postId, notifyNewSpecificUsers = emptyFn) => {
    setIsOpen(true);
    setSpecificUsersModalData({ programId, notifyNewSpecificUsers, postId });
  };

  return (
    <SpecificUsersContext.Provider value={{ openSpecificUsersModal }}>
      <div key={reloadPostsKey}>{postId ? <SinglePostWall /> : <PostListWrapper />}</div>
      <SpecificUsersModal
        {...{
          isOpen,
          setIsOpen,
          postId,
          setReloadPostsKey,
          ...specificUsersModalData
        }}
      />
    </SpecificUsersContext.Provider>
  );
};

export default WallBaseBlock;
