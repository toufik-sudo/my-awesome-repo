import { setBdcDemandModelApi, getBdcInvoiceParamsApi } from 'components/pages/wall/bdcWinsDemand/BdcDemandModel';
import axiosInstance from 'config/axiosConfig';
import { GET_WINS_COMPANY_ENDPOINT,
  SET_WINS_COMPANY_ENDPOINT,
  UPDATE_WINS_COMPANY_ENDPOINT,
  SET_BDC_DEMAND_HISTORY_ENDPOINT,
  UPDATE_BDC_DEMAND_HISTORY_ENDPOINT,
  GET_BDC_DEMAND_HISTORY_ENDPOINT,
  GET_BDC_DETAILS_ENDPOINT,
  GET_INVOICE_DETAILS_ENDPOINT, 
  GET_ALL_EXPIRED_WINS_COMPANY_ENDPOINT
} from 'constants/api';
// import { BdcDemandModelApi, companyModelApi, setBdcDemandModelApi, getBdcInvoiceParamsApi } from './BdcDemandModel';

class BdcDemandApi {
  async getWinsCompany(programId, userUuid) {
    const { data } = await axiosInstance().get(GET_WINS_COMPANY_ENDPOINT, { 
      params:{
        programId,
        userUuid 
      }
  });

    return data;
  }
  
  async setWinsCompany(body) {
    const { data } = await axiosInstance().post(SET_WINS_COMPANY_ENDPOINT, body);
    
    return data;
    }
    
  async updateWinsCompany(body) {
    const { data } = await axiosInstance().post(UPDATE_WINS_COMPANY_ENDPOINT, body);
    
    return data;
  }
  
  async setBdcDemandHisory(body: setBdcDemandModelApi) {
    const payload = JSON.stringify(body);
    const data = await axiosInstance().post(SET_BDC_DEMAND_HISTORY_ENDPOINT, payload);
    return data;
  }

  async updateBdcDemandHisory(body: setBdcDemandModelApi) {
    const { data } = await axiosInstance().post(UPDATE_BDC_DEMAND_HISTORY_ENDPOINT, body);

    return data;
  }

  async getBdcDemandHistory(params?: getBdcInvoiceParamsApi) {
    const { data } = await axiosInstance().get(GET_BDC_DEMAND_HISTORY_ENDPOINT, {
      params:params
    });
    return data;
  }
  
  async getBdcDetails(params: getBdcInvoiceParamsApi) {
    const { data } = await axiosInstance().get(GET_BDC_DETAILS_ENDPOINT, {
      params:{
        bdcId: params.bdcId,
        invoiceId: params.invoiceId,
        userAdminUuId: params.userAdminUuId
      }
    });
    return data;
  }

  async getInvoiceDetails(params: getBdcInvoiceParamsApi) {
    const { data } = await axiosInstance().get(GET_INVOICE_DETAILS_ENDPOINT, {
      params:{
        bdcId: params.bdcId,
        invoiceId: params.invoiceId,
        userAdminUuId: params.userAdminUuId
      }
    });

    return data;
  }

  async getAllExpiredWins(userUuid, platformId, programId) {
    const { data } = await axiosInstance().get(GET_ALL_EXPIRED_WINS_COMPANY_ENDPOINT, { 
      params:{
        userUuid : userUuid,
        platformId: platformId,
        programId: programId,
      }
  });
  
    return data;
  }
}
      
export default BdcDemandApi;
