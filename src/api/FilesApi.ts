import axiosInstance from 'config/axiosConfig';
import envConfig from 'config/envConfig';
import {
  API_V1,
  CONTENT_TYPE,
  CONTENT_DISPOSITION,
  MAX_TIMEOUT_PERIOD,
  MULTIPART_FORM_DATA,
  BLOB,
  GET,
  POST,
  UPLOAD_FILES_ENDPOINT
} from 'constants/api';
import { IFileUpload } from 'interfaces/api/IFileUpload';
import { IFileDownload } from 'interfaces/api/IFileDownload';
import { trimUrl } from 'utils/api';
import axios from 'axios';

class FilesApi {
  async downloadFile(endpointUrl: string, queryParams?: any, nameForFile: any = 'file'): Promise<IFileDownload> {
    const { data, headers } = await axiosInstance()({
      method: GET,
      url: endpointUrl,
      params: queryParams,
      responseType: BLOB
    });

    const filename = headers[CONTENT_DISPOSITION] ? headers[CONTENT_DISPOSITION].split('filename=')[1] : nameForFile;
    const contentType = headers[CONTENT_TYPE.toLowerCase()];

    return {
      file: data,
      filename,
      contentType
    };
  }

  uploadFiles(files: IFileUpload[]) {
    const url = `${trimUrl(envConfig.backendUrl, API_V1)}${UPLOAD_FILES_ENDPOINT}`;
    console.log("Ceci est files")
    console.log(files[0].file)
    return this.uploadFileToUrl(url, { data: files });
  }

  uploadFileToUrl(url: string, fileData: any) {
    return axiosInstance()({
      method: POST,
      url,
      data: this.buildFormData(fileData),
      headers: { [CONTENT_TYPE]: MULTIPART_FORM_DATA },
      timeout: MAX_TIMEOUT_PERIOD
    });
  }

  private buildFormData(data: any, formData: FormData = new FormData(), namespace?: string): FormData {
    for (const property in data) {
      let formKey = property;

      if (data[property] !== undefined && data[property] !== null) {
        if (namespace) {
          formKey = `${namespace}[${property}]`;
        }

        if (typeof data[property] === 'object' && !(data[property] instanceof File)) {
          this.buildFormData(data[property], formData, formKey);
        } else {
          formData.append(formKey, data[property]);
        }
      }
    }
    console.log("Ceci est formdata")
    console.log(formData)

    return formData;
  }

  async downloadImages(url) { 
    const options = {
      method: "GET",
      headers: new Headers({'content-type': 'image/png'})
    }
    return await fetch('/cr-dev-user-profile-images/blob_172485252766cf292f8f84c.', options)
      .then(
        response => response.blob()
      )
      .then(blob => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        return new Promise((res) => {
          reader.onloadend = () => {
          res(reader.result);
        }})
      })    
  }

}

export default FilesApi;
