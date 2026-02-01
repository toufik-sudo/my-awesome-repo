// -----------------------------------------------------------------------------
// Comments API
// Migrated from old_app/src/api/CommentsApi.ts
// -----------------------------------------------------------------------------

import axiosInstance from '@/config/axiosConfig';
import FilesApi from '@/api/FilesApi';
import { COMMENTS_ENDPOINT } from '@/constants/api';
import type { IFileUpload } from '@/api/types';

class CommentsApi {
  private filesApi: FilesApi;

  constructor() {
    this.filesApi = new FilesApi();
  }

  createComment(comment: any) {
    return axiosInstance().post(COMMENTS_ENDPOINT, comment);
  }

  deleteComment(commentId: number) {
    return axiosInstance().delete(`${COMMENTS_ENDPOINT}/${commentId}`);
  }

  async uploadFile(fileUpload: IFileUpload) {
    const result = await this.filesApi.uploadFiles([fileUpload]);
    return result[0].id;
  }
}

export const commentsApi = new CommentsApi();
export default CommentsApi;
