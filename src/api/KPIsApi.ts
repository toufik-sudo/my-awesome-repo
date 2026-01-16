import axiosInstance from 'config/axiosConfig';

class KPIsApi {
  async getKPIs(endpoint, payload) {
    const { data } = await axiosInstance().get(endpoint, {
      params: payload
    });

    return data;
  }
}

export default KPIsApi;
