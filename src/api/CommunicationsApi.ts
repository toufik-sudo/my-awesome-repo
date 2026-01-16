import qs from 'qs';

import axiosInstance from 'config/axiosConfig';
import { EMAIL_CAMPAIGN_ENDPOINT, USER_LIST_ENDPOINT, USERS_ENDPOINT, EMAIL_TEMPLATES_ENDPOINT } from 'constants/api';

class CommunicationsApi {
  /**
   * Uses given params to get email campaigns based on filters and sort fields
   */
  getEmailCampaignsData(params) {
    return axiosInstance().get(EMAIL_CAMPAIGN_ENDPOINT, { params });
  }

  /**
   *  Uses given params to get user email lists based on filters and sort fields
   */
  getListData(params) {
    return axiosInstance().get(USER_LIST_ENDPOINT, { params });
  }

  /**
   * Deletes the user based on a provided UUID
   */
  deleteUser(uuid) {
    return axiosInstance().delete(`${USER_LIST_ENDPOINT}/${uuid}`);
  }

  /**
   *  Uses given params to get users based on filters and sort fields
   */
  getUsersData(params) {
    return axiosInstance().get(USERS_ENDPOINT, {
      params,
      paramsSerializer: params =>
        qs.stringify(params, {
          arrayFormat: 'brackets',
          skipNulls: true
        })
    });
  }

  /**
   *  Uses given params to get users based on filters and sort fields
   */
  getEmailUserListData(userId, params) {
    return axiosInstance().get(`${USER_LIST_ENDPOINT}/${userId}`, { params });
  }

  /**
   *  Uses given payload to a create a user list
   */
  saveUserList({ payload }) {
    return axiosInstance().post(USER_LIST_ENDPOINT, payload);
  }

  /**
   *  Uses given payload to update user list with given id
   */
  editUserList({ currentEditableUserListId, payload }) {
    return axiosInstance().put(`${USER_LIST_ENDPOINT}/${currentEditableUserListId}`, payload);
  }

  /**
   *  Uses given payload to update user list with given id
   */
  createEmailCampaign(payload) {
    return axiosInstance().post(EMAIL_CAMPAIGN_ENDPOINT, payload);
  }

  /**
   *  Uses given payload to update user list with given id
   */
  createEmailTemplate(payload) {
    return axiosInstance().post(EMAIL_TEMPLATES_ENDPOINT, payload);
  }
}

export default CommunicationsApi;
