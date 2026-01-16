import React, { useContext, memo } from 'react';

import { UserContext } from 'components/App';

import style from 'sass-boilerplate/stylesheets/components/wall/WallPostBaseBlock.module.scss';

/**
 * Molecule component used to render Create Post Avatar
 *
 * @constructor
 */
const CreatePostAvatar = () => {
  const { userData, setImgLoaded } = useContext(UserContext);
  const { croppedPicturePath } = userData;

  return (
    <div className={style.wallPostIcon}>
      <img src={croppedPicturePath} alt="user icon" onLoad={() => setImgLoaded(true)} />
    </div>
  );
};

export default memo(CreatePostAvatar);
