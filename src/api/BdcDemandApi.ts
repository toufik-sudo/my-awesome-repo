// -----------------------------------------------------------------------------
// BDC Demand API
// Migrated from old_app/src/api/BdcDemandApi.ts
// -----------------------------------------------------------------------------

import axiosInstance from '@/config/axiosConfig';
import {
  GET_WINS_COMPANY_ENDPOINT,
  SET_WINS_COMPANY_ENDPOINT,
  UPDATE_WINS_COMPANY_ENDPOINT,
  SET_BDC_DEMAND_HISTORY_ENDPOINT,
  UPDATE_BDC_DEMAND_HISTORY_ENDPOINT,
  GET_BDC_DEMAND_HISTORY_ENDPOINT,
  GET_BDC_DETAILS_ENDPOINT,
  GET_INVOICE_DETAILS_ENDPOINT,
  GET_ALL_EXPIRED_WINS_COMPANY_ENDPOINT
} from '@/constants/api';

export interface IBdcDemandModel {
  id?: number;
  programId?: number;
  userUuid?: string;
  [key: string]: unknown;
}

export interface IBdcInvoiceParams {
  bdcId?: number;
  invoiceId?: number;
  userAdminUuId?: string;
  [key: string]: unknown;
}

export interface IWinsCompanyParams {
  programId: number;
  userUuid: string;
}

export interface IExpiredWinsParams {
  userUuid: string;
  platformId: number;
  programId: number;
}

class BdcDemandApi {
  async getWinsCompany(programId: number, userUuid: string) {
    const { data } = await axiosInstance().get(GET_WINS_COMPANY_ENDPOINT, {
      params: { programId, userUuid }
    });
    return data;
  }

  async setWinsCompany(body: unknown) {
    const { data } = await axiosInstance().post(SET_WINS_COMPANY_ENDPOINT, body);
    return data;
  }

  async updateWinsCompany(body: unknown) {
    const { data } = await axiosInstance().post(UPDATE_WINS_COMPANY_ENDPOINT, body);
    return data;
  }

  async setBdcDemandHistory(body: IBdcDemandModel) {
    const payload = JSON.stringify(body);
    const { data } = await axiosInstance().post(SET_BDC_DEMAND_HISTORY_ENDPOINT, payload);
    return data;
  }

  async updateBdcDemandHistory(body: IBdcDemandModel) {
    const { data } = await axiosInstance().post(UPDATE_BDC_DEMAND_HISTORY_ENDPOINT, body);
    return data;
  }

  async getBdcDemandHistory(params?: IBdcInvoiceParams) {
    const { data } = await axiosInstance().get(GET_BDC_DEMAND_HISTORY_ENDPOINT, {
      params
    });
    return data;
  }

  async getBdcDetails(params: IBdcInvoiceParams) {
    const { data } = await axiosInstance().get(GET_BDC_DETAILS_ENDPOINT, {
      params: {
        bdcId: params.bdcId,
        invoiceId: params.invoiceId,
        userAdminUuId: params.userAdminUuId
      }
    });
    return data;
  }

  async getInvoiceDetails(params: IBdcInvoiceParams) {
    const { data } = await axiosInstance().get(GET_INVOICE_DETAILS_ENDPOINT, {
      params: {
        bdcId: params.bdcId,
        invoiceId: params.invoiceId,
        userAdminUuId: params.userAdminUuId
      }
    });
    return data;
  }

  async getAllExpiredWins(userUuid: string, platformId: number, programId: number) {
    const { data } = await axiosInstance().get(GET_ALL_EXPIRED_WINS_COMPANY_ENDPOINT, {
      params: {
        userUuid,
        platformId,
        programId
      }
    });
    return data;
  }
}

export const bdcDemandApi = new BdcDemandApi();
export default BdcDemandApi;
