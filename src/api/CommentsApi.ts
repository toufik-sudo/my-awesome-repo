import axiosInstance from 'config/axiosConfig';

import FilesApi from 'api/FilesApi';
import { IFileUpload } from 'interfaces/api/IFileUpload';
import { COMMENTS_ENDPOINT } from 'constants/api';

/**
 * File used to handle comments APIs
 */
class CommentsApi {
  private filesApi: FilesApi;

  constructor() {
    this.filesApi = new FilesApi();
  }

  createComment(comment) {
    return axiosInstance().post(COMMENTS_ENDPOINT, comment);
  }

  deleteComment(commentId) {
    return axiosInstance().delete(`${COMMENTS_ENDPOINT}/${commentId}`);
  }

  async uploadFile(fileUpload: IFileUpload) {
    const { data } = await this.filesApi.uploadFiles([fileUpload]);

    return data[0].id;
  }
}

export default CommentsApi;
