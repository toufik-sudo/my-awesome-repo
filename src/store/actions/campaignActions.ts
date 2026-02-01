import axiosInstance from '@/config/axiosConfig';
import { EMAIL_CAMPAIGN_ENDPOINT } from '@/constants/api';

interface CampaignParams {
  programId?: number;
  platformId?: number;
  status?: number;
  page?: number;
  size?: number;
}

/**
 * Method used to get communications email campaigns
 * @param params - Query parameters for filtering campaigns
 */
export const getEmailCampaignsData = (params: CampaignParams): Promise<any> => {
  return axiosInstance().get(EMAIL_CAMPAIGN_ENDPOINT, { params });
};
