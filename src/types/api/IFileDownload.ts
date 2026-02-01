/**
 * File download interface
 */
export interface IFileDownload {
  file: Blob;
  filename: string;
  contentType: string;
}
