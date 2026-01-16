import axiosInstance from 'config/axiosConfig';
import { SUBSCRIPTION } from 'constants/api';
import { IPaymentDTO } from 'interfaces/api/IPaymentDTO';

class PaymentApi {
  async createSubscription(payload: IPaymentDTO) {
    const { data } = await axiosInstance().post(SUBSCRIPTION, payload);

    return data;
  }
}

export default PaymentApi;
