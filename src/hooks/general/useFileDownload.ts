// -----------------------------------------------------------------------------
// useFileDownload Hook
// Utility hook for downloading files
// -----------------------------------------------------------------------------

import { useRef, useCallback } from 'react';

export interface IFileDownload {
  file: Blob;
  filename: string;
}

const LINK_ATTRIBUTE = {
  DOWNLOAD: 'download'
} as const;

/**
 * Hook used for downloading files
 * @param downloadFile - Function that returns file data
 */
export const useFileDownload = (downloadFile: (params?: any) => Promise<IFileDownload | null>) => {
  const linkRef = useRef<HTMLAnchorElement | null>(null);

  const download = useCallback(
    async (params?: any) => {
      const fileData = await downloadFile(params);
      if (!fileData) {
        return;
      }

      // Handle legacy IE
      if (window.navigator && (window.navigator as any).msSaveOrOpenBlob) {
        (window.navigator as any).msSaveOrOpenBlob(fileData.file, fileData.filename);
        return;
      }

      if (linkRef.current) {
        const url = window.URL.createObjectURL(fileData.file);
        linkRef.current.href = url;
        linkRef.current.setAttribute(LINK_ATTRIBUTE.DOWNLOAD, fileData.filename);
        linkRef.current.click();
        
        // Cleanup
        setTimeout(() => {
          window.URL.revokeObjectURL(url);
        }, 100);
      }
    },
    [downloadFile]
  );

  return { linkRef, download };
};

export default useFileDownload;
