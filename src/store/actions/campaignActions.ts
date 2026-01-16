import axiosInstance from 'config/axiosConfig';
import { EMAIL_CAMPAIGN_ENDPOINT } from 'constants/api';

/**
 * Method used to get communications email campaigns
 */
export const getEmailCampaignsData = params => {
  return axiosInstance().get(EMAIL_CAMPAIGN_ENDPOINT, { params });
};
