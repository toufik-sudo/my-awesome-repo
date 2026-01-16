import axiosInstance from 'config/axiosConfig';
import { CONTACT_US_ENDPOINT } from 'constants/api';

class ContactUsApi {
  async contactUs(platformId, paymentMethod) {
    const { data } = await axiosInstance().post(CONTACT_US_ENDPOINT, { platformId, paymentMethod });

    return data;
  }
}

export default ContactUsApi;
