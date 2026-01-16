import { useState, useRef, useCallback } from 'react';

/**
 *  Hook used to handle file selection for posts.
 *  @param onFileUpload callback that handles the file upload
 */
export const useSelectFile = onFileUpload => {
  const [fileType, setFileType] = useState({ type: undefined, format: undefined, trigger: false });
  const uploadTrigger = useRef(null);

  const setFileTypeToUpload = newFileType => {
    uploadTrigger.current.value = '';
    setFileType({ ...newFileType, trigger: !fileType.trigger });
    if (newFileType) {
      uploadTrigger.current.accept = newFileType.format;
      uploadTrigger.current.click();
    }
  };

  const handleFileUpload = useCallback(
    e => {
      if (e.target.files.length) {
        onFileUpload({ file: e.target.files[0], fileType });
      }
    },
    [fileType, onFileUpload]
  );

  return {
    uploadTrigger,
    setFileTypeToUpload,
    handleFileUpload
  };
};
