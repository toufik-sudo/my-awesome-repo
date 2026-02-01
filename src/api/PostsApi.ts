// -----------------------------------------------------------------------------
// Posts API
// Migrated from old_app/src/api/PostsApi.ts
// -----------------------------------------------------------------------------

import qs from 'qs';
import axiosInstance from '@/config/axiosConfig';
import FilesApi from '@/api/FilesApi';
import { POSTS_ENDPOINT, LIKES_ENDPOINT } from '@/constants/api';
import { POST_VIEW_TYPE, POST_TYPE } from '@/constants/wall/posts';
import type { IFileUpload, IPostSearchCriteria, IPeriod } from '@/api/types';
import { formatDateAsIso } from '@/utils/dateUtils';

class PostsApi {
  private filesApi: FilesApi;

  constructor() {
    this.filesApi = new FilesApi();
  }

  getPost(postId: number | string) {
    return axiosInstance().get(`${POSTS_ENDPOINT}/${postId}`);
  }

  async getPosts(searchCriteria: IPostSearchCriteria): Promise<any> {
    const { data } = await axiosInstance().get(POSTS_ENDPOINT, {
      params: searchCriteria,
      paramsSerializer: (params) =>
        qs.stringify(params, {
          skipNulls: true,
          serializeDate: formatDateAsIso
        })
    });
    return data;
  }

  async getTasksWithinAgenda(platformId: number, period: IPeriod, programId?: number): Promise<any[]> {
    const { posts } = await this.getPosts({
      platform: platformId,
      program: programId,
      ...period,
      type: POST_TYPE.TASK,
      view: POST_VIEW_TYPE.AGENDA
    });
    return posts;
  }

  createPost(post: any) {
    return axiosInstance().post(POSTS_ENDPOINT, post);
  }

  deletePost(postId: number) {
    return axiosInstance().delete(`${POSTS_ENDPOINT}/${postId}`);
  }

  async likePost(postId: number): Promise<number> {
    const {
      data: { likeId }
    } = await axiosInstance().post(`${LIKES_ENDPOINT}`, { postId });
    return likeId;
  }

  async unlikePost(likeId: number): Promise<void> {
    await axiosInstance().delete(`${LIKES_ENDPOINT}/${likeId}`);
  }

  async uploadFile(fileUpload: IFileUpload) {
    const result = await this.filesApi.uploadFiles([fileUpload]);
    return result[0].id;
  }

  updatePost(postId: number, post: any) {
    const ENDPOINT = POSTS_ENDPOINT + '/' + postId;
    return axiosInstance().put(ENDPOINT, post);
  }
}

export const postsApi = new PostsApi();
export default PostsApi;
