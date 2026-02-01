// -----------------------------------------------------------------------------
// Contact Form API
// Handles contact form submissions
// -----------------------------------------------------------------------------

import axiosInstance from '@/config/axiosConfig';
import { CONTACT_FORM_LOGS_ENDPOINT } from '@/constants/api';

export interface IContactFormPayload {
  name: string;
  email: string;
  message: string;
  needsSuperAdmin?: boolean;
  platformId?: number;
}

export interface IContactFormResponse {
  success: boolean;
  message?: string;
}

class ContactFormApi {
  /**
   * Submit contact form data
   */
  async submitContactForm(payload: IContactFormPayload): Promise<IContactFormResponse> {
    const processedPayload = {
      data: {
        ...payload,
        needsSuperAdmin: payload.needsSuperAdmin ? 'true' : undefined,
      }
    };
    
    const { data } = await axiosInstance().post(CONTACT_FORM_LOGS_ENDPOINT, processedPayload);
    return data;
  }
}

// Export singleton instance
export const contactFormApi = new ContactFormApi();
export default ContactFormApi;
