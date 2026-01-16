import React, { useContext } from 'react';
import Editor from 'react-avatar-editor';

import AvatarEditorControls from 'components/molecules/avatar/AvatarEditorControls';
import AvatarEditorActions from 'components/molecules/avatar/AvatarEditorActions';
import { useImageCropEditor } from 'hooks/useImageCropEditor';

import style from 'assets/style/components/PersonalInformation/AvatarCreator.module.scss';

/**
 * Organism component used to render the avatar editor
 *
 * @constructor
 */
const AvatarEditor = ({ closeModal, context, config, imageModal }) => {
  const { saveImage, setEditorRef, avatarConfig, setAvatarConfig } = useImageCropEditor(closeModal, context);

  const {
    full: { fullAvatar }
  } = useContext(context);

  return (
    <div className={style.avatarCreator}>
      <Editor
        ref={setEditorRef}
        image={fullAvatar}
        {...config}
        disableHiDPIScaling
        scale={avatarConfig.zoom}
        rotate={avatarConfig.rotate}
        border={50}
      />
      <AvatarEditorControls {...{ setAvatarConfig, avatarConfig, imageModal }} />
      <AvatarEditorActions {...{ closeModal, saveImage }} />
    </div>
  );
};

export default AvatarEditor;
