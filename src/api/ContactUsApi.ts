// -----------------------------------------------------------------------------
// Contact Us API
// Migrated from old_app/src/api/ContactUsApi.ts
// -----------------------------------------------------------------------------

import axiosInstance from '@/config/axiosConfig';
import { CONTACT_US_ENDPOINT } from '@/constants/api';

export interface IContactUsPayload {
  platformId: number;
  paymentMethod: string;
}

export interface IContactUsResponse {
  success: boolean;
  message?: string;
}

class ContactUsApi {
  async contactUs(platformId: number, paymentMethod: string): Promise<IContactUsResponse> {
    const { data } = await axiosInstance().post(CONTACT_US_ENDPOINT, { 
      platformId, 
      paymentMethod 
    });
    return data;
  }
}

export const contactUsApi = new ContactUsApi();
export default ContactUsApi;
