// -----------------------------------------------------------------------------
// AI Personalization API
// Migrated from old_app/src/api/IA API/AiPersoApi.ts
// -----------------------------------------------------------------------------

import axiosInstance from '@/config/axiosConfig';
import type { IAiPersoProfile, IAiPersoRequest, IAiPersoResponse, IAiAdminProgram } from '@/features/ai/types';

// API Endpoints
const GET_IA_PERSO_API = '/iaPersoCompany/getIaPersoCompany';
const GET_IA_API = '/iaPersoCompany/getIaCompany';
const SET_UPDATE_IA_PERSO_API = '/iaPersoCompany/setOrUpdateIaPersoCompany';

export interface IGetIaPersoParams {
  userUuid?: string;
}

export interface IGetIaCompanyResponse {
  data: Array<{
    programId: number;
    programName: string;
    companyName: string;
    iaName: string;
    iaType: string;
  }>;
}

class AiPersoApi {
  /**
   * Get AI personalization profiles for a company
   */
  async getIaPersoCompany(params?: IGetIaPersoParams): Promise<IAiPersoResponse> {
    try {
      const response = await axiosInstance().get(GET_IA_PERSO_API, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching AI perso profiles:', error);
      throw error;
    }
  }

  /**
   * Get AI company programs (programs with AI associations)
   */
  async getIaCompany(params?: Record<string, unknown>): Promise<IGetIaCompanyResponse> {
    try {
      const response = await axiosInstance().get(GET_IA_API, { params });
      return response.data;
    } catch (error) {
      console.error('Error getting iaCompany data:', error);
      throw error;
    }
  }

  /**
   * Create or update an AI personalization profile
   */
  async setOrUpdateIaPersoCompany(payload: IAiPersoRequest): Promise<IAiPersoProfile> {
    try {
      const response = await axiosInstance().post(SET_UPDATE_IA_PERSO_API, payload);
      return response.data;
    } catch (error) {
      console.error('Error saving AI perso profile:', error);
      throw error;
    }
  }

  /**
   * Transform raw API response to IAiAdminProgram array
   */
  transformToAdminPrograms(data: IGetIaCompanyResponse['data']): IAiAdminProgram[] {
    if (!data?.length) return [];
    
    return data.map(element => ({
      id: element.programId,
      name: `${element.programName?.trim()} ( ${element.iaName?.trim()} )`,
      companyName: element.companyName,
      programName: `${element.programName?.trim()}_${element.programId}`,
      iaName: element.iaName?.trim().replace(/\s+/g, '_'),
      iaType: element.iaType?.trim(),
    }));
  }
}

export const aiPersoApi = new AiPersoApi();
export default aiPersoApi;
