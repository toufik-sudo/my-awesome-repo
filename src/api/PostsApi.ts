import qs from 'qs';

import axiosInstance from 'config/axiosConfig';
import FilesApi from 'api/FilesApi';
import MomentUtilities from 'utils/MomentUtilities';
import { IFileUpload } from 'interfaces/api/IFileUpload';
import { POSTS_ENDPOINT, LIKES_ENDPOINT } from 'constants/api';
import { IPostSearchCriteria } from 'interfaces/api/post/IPostSearchCriteria';
import { IPeriod } from 'interfaces/IPeriod';
import { POST_VIEW_TYPE, POST_TYPE } from 'constants/wall/posts';

class PostsApi {
  private filesApi: FilesApi;

  constructor() {
    this.filesApi = new FilesApi();
  }

  getPost(postId: any) {
    return axiosInstance().get(`${POSTS_ENDPOINT}/${postId}`);
  }

  async getPosts(searchCriteria: IPostSearchCriteria): Promise<any> {
    const { data } = await axiosInstance().get(POSTS_ENDPOINT, {
      params: searchCriteria,
      paramsSerializer: params =>
        qs.stringify(params, {
          skipNulls: true,
          serializeDate: MomentUtilities.formatDateAsIso
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

  createPost(post) {
    return axiosInstance().post(POSTS_ENDPOINT, post);
  }

  deletePost(postId) {
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
    const { data } = await this.filesApi.uploadFiles([fileUpload]);

    return data[0].id;
  }

  updatePost(postId, post) {
    const ENDPOINT = POSTS_ENDPOINT + '/' + postId;

    return axiosInstance().put(ENDPOINT, post);
  }
}

export default PostsApi;
