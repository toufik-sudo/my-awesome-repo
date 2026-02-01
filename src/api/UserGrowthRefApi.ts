// -----------------------------------------------------------------------------
// User Growth Ref API
// Migrated from old_app/src/api/UserGrowthRefApi.ts
// -----------------------------------------------------------------------------

import axiosInstance from '@/config/axiosConfig';
import FilesApi from '@/api/FilesApi';
import envConfig from '@/config/envConfig';
import { API_V1, USER_GROWTH_REF_UPLOAD_ENDPOINT } from '@/constants/api';
import { trimUrl } from '@/utils/api';

export interface IGrowthRefFile {
  file: File;
  filename: string;
  programId: number;
  [key: string]: unknown;
}

export interface IGrowthRefUploadResponse {
  id?: number;
  url?: string;
  errors?: string[];
  [key: string]: unknown;
}

class UserGrowthRefApi {
  private filesApi: FilesApi;

  constructor() {
    this.filesApi = new FilesApi();
  }

  async uploadGrowthRefFiles(growthRefFile: IGrowthRefFile): Promise<IGrowthRefUploadResponse[]> {
    const endpointUrl = `${trimUrl(envConfig.backendUrl, API_V1)}${USER_GROWTH_REF_UPLOAD_ENDPOINT}`;
    const response = await this.filesApi.uploadFileToUrl(endpointUrl, growthRefFile as unknown as Record<string, unknown>);
    return response.data as IGrowthRefUploadResponse[];
  }
}

export const userGrowthRefApi = new UserGrowthRefApi();
export default UserGrowthRefApi;
