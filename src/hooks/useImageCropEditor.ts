import { useContext, useState } from 'react';

/**
 * Hook used to submit image and close modal (set crop image and maintain settings based on the previous changes)
 *
 * @param closeModal
 * @param context
 */
export const useImageCropEditor = (closeModal, context) => {
  const [editor, setEditor] = useState(null);
  const setEditorRef = editor => setEditor(editor);
  const {
    cropped: { setCroppedAvatar },
    config: { avatarConfig, setAvatarConfig }
  } = useContext(context);

  const saveImage = () => {
    if (editor) {
      setCroppedAvatar(editor.getImageScaledToCanvas().toDataURL());
      setAvatarConfig(avatarConfig);
      closeModal();
    }
  };

  return { setEditorRef, saveImage, avatarConfig, setAvatarConfig };
};
