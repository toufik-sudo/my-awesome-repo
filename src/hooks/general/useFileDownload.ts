import { useRef, useCallback } from 'react';

import { IFileDownload } from 'interfaces/api/IFileDownload';
import { LINK_ATTRIBUTE } from 'constants/ui';

/**
 * Hook used for downloading files
 */
const useFileDownload = (downloadFile: (params?: any) => Promise<IFileDownload>) => {
  const linkRef = useRef<any>();

  const download = useCallback(
    async (params?: any) => {
      const fileData = await downloadFile(params);
      if (!fileData) {
        return;
      }

      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(fileData.file, fileData.filename);
        return;
      }

      if (linkRef.current) {
        const url = window.URL.createObjectURL(fileData.file);
        linkRef.current.href = url;
        linkRef.current.setAttribute(LINK_ATTRIBUTE.DOWNLOAD, fileData.filename);
        linkRef.current.click();
      }
    },
    [downloadFile, linkRef.current, window]
  );

  return { linkRef, download };
};

export default useFileDownload;
