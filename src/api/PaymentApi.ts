// -----------------------------------------------------------------------------
// Payment API
// Migrated from old_app/src/api/PaymentApi.ts
// -----------------------------------------------------------------------------

import axiosInstance from '@/config/axiosConfig';
import { SUBSCRIPTION } from '@/constants/api';

export interface IPaymentDTO {
  frequencyOfPaymentId?: number;
  platformId: string;
}

export interface ISubscriptionResponse {
  subscriptionId?: string;
  clientSecret?: string;
  status?: string;
}

class PaymentApi {
  async createSubscription(payload: IPaymentDTO): Promise<ISubscriptionResponse> {
    const { data } = await axiosInstance().post(SUBSCRIPTION, payload);
    return data;
  }
}

export const paymentApi = new PaymentApi();
export default PaymentApi;
