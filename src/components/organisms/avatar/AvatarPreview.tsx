import React, { useContext } from 'react';

import AvatarSelectionPreview from 'components/molecules/avatar/AvatarSelectionPreview';
import { emptyFn } from 'utils/general';

/**
 * Organism component used to render a avatar preview
 *
 * @constructor
 */
const AvatarPreview = ({ style, context, setImageError = emptyFn() }) => {
  const { deleteImage, deleteImageWrapper, defaultImage } = style;
  let avatarOutput = <div className={defaultImage} />;
  const {
    cropped: { croppedAvatar, setCroppedAvatar }
  } = useContext(context);

  if (croppedAvatar) {
    avatarOutput = <AvatarSelectionPreview {...{ croppedAvatar, setCroppedAvatar, setImageError }} />;
  }

  return (
    <div className={deleteImage}>
      <div className={deleteImageWrapper}>{avatarOutput}</div>
    </div>
  );
};

export default AvatarPreview;
