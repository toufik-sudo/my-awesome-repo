// -----------------------------------------------------------------------------
// Files API Service
// Handles file uploads and downloads
// -----------------------------------------------------------------------------

import axiosInstance from '@/config/axiosConfig';
import hostAxiosInstance from '@/config/hostAxiosConfig';
import envConfig from '@/config/envConfig';
import {
  UPLOAD_FILES_ENDPOINT,
  CONTENT_TYPE,
  CONTENT_DISPOSITION,
  MULTIPART_FORM_DATA,
  MAX_TIMEOUT_PERIOD
} from '@/constants/api';
import { IFileUpload, IFileDownload } from './types';

class FilesApi {
  /**
   * Download a file from an endpoint
   * Uses hostAxiosInstance (envConfig.backendHostUrl)
   */
  async downloadFile(
    endpointUrl: string,
    queryParams?: Record<string, unknown>,
    fileName: string = 'file'
  ): Promise<IFileDownload> {
    const { data, headers } = await hostAxiosInstance()({
      method: 'GET',
      url: endpointUrl,
      params: queryParams,
      responseType: 'blob'
    });

    const contentDisposition = headers[CONTENT_DISPOSITION] || headers['content-disposition'];
    const filename = contentDisposition
      ? contentDisposition.split('filename=')[1]?.replace(/"/g, '')
      : fileName;
    const contentType = headers[CONTENT_TYPE.toLowerCase()] || headers['content-type'];

    return {
      file: data,
      filename,
      contentType
    };
  }

  /**
   * Upload multiple files (legacy; prefer uploadFileToUrl for launch)
   * Uses hostAxiosInstance (envConfig.backendHostUrl)
   */
  async uploadFiles(files: IFileUpload[]): Promise<{ id: number; url?: string }[]> {
    const url = `${envConfig.backendHostUrl}${UPLOAD_FILES_ENDPOINT}`;
    const formData = this.buildFormData({ data: files });

    const { data } = await hostAxiosInstance()({
      method: 'POST',
      url,
      data: formData,
      headers: { [CONTENT_TYPE]: MULTIPART_FORM_DATA },
      timeout: MAX_TIMEOUT_PERIOD
    });

    return data;
  }

  /**
   * Upload file to a custom URL (used for launch: always '/file/upload')
   * Accepts FormData directly
   * Uses hostAxiosInstance (envConfig.backendHostUrl)
   */
  async uploadFileToUrl(
    url: string,
    formData: FormData
  ): Promise<{ data: { id: number; url?: string; filename?: string; publicPath?: string }[] }> {
    return hostAxiosInstance()({
      method: 'POST',
      url,
      data: formData,
      headers: { [CONTENT_TYPE]: MULTIPART_FORM_DATA },
      timeout: MAX_TIMEOUT_PERIOD
    });
  }

  /**
   * Get file URL by ID
   * Uses envConfig.backendHostUrl
   */
  getFileUrl(fileId: number): string {
    return `${envConfig.backendHostUrl}/files/${fileId}`;
  }

  /**
   * Build FormData from object (recursive)
   */
  private buildFormData(
    data: Record<string, unknown>,
    formData: FormData = new FormData(),
    namespace?: string
  ): FormData {
    for (const property in data) {
      if (Object.prototype.hasOwnProperty.call(data, property)) {
        const value = data[property];
        let formKey = namespace ? `${namespace}[${property}]` : property;

        if (value !== undefined && value !== null) {
          if (value instanceof File) {
            formData.append(formKey, value);
          } else if (typeof value === 'object' && !(value instanceof Blob)) {
            this.buildFormData(value as Record<string, unknown>, formData, formKey);
          } else {
            formData.append(formKey, String(value));
          }
        }
      }
    }

    return formData;
  }
}

// Export singleton instance
export const filesApi = new FilesApi();
export default FilesApi;