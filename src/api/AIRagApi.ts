// -----------------------------------------------------------------------------
// AI RAG API
// Migrated from old_app/src/api/IA API/AIRagApi.ts
// -----------------------------------------------------------------------------

import axios from 'axios';
import axiosInstance from '@/config/axiosConfig';

// Route constants (should be moved to constants file if needed)
const RAG_BASE_URL = import.meta.env.VITE_RAG_API_URL || '';
const RAG_ROUTE = `${RAG_BASE_URL}/upload`;
const RAG_ROUTE_LINK = `${RAG_BASE_URL}/upload-link`;
const GET_RAG_INDEX_ROUTE = '/api/rag/index';
const SET_RAG_INDEX_ROUTE = '/api/rag/index';
const RESET_RAG_INDEX_ROUTE = '/api/rag/index/reset';
const RESET_NAMESPACE_RAG_ROUTE = `${RAG_BASE_URL}/reset-namespace`;
const SEND_EMAIL_RESET_NAMESPACE_RAG_ROUTE = `${RAG_BASE_URL}/send-email-reset`;
const GET_RAG_TOKENS_COUNT_ROUTE = `${RAG_BASE_URL}/tokens-count`;
const GET_RAG_TOKENS_COUNT_FILE_ROUTE = `${RAG_BASE_URL}/tokens-count/file`;

export interface IRagUploadParams {
  file?: File[];
  companyName: string;
  programName: string;
  isCommon: boolean;
  fileName: string;
  userEmail: string;
  iaName: string;
  iaType: string;
  isLink?: boolean;
  url?: string;
}

export interface IRagIndexParams {
  isToBlockCat: boolean;
  userUuid: string;
  programId: string;
  status: string;
  comment?: string;
  errorCode?: string;
  errorMsg?: string;
  isCommon: boolean;
  catName: string;
  originalFilename: string;
  iaType: string;
  link?: string;
}

class AIRAGApi {
  /**
   * Upload files to RAG system
   */
  async uploadFiles(params: IRagUploadParams): Promise<any> {
    const {
      file,
      companyName,
      programName,
      isCommon,
      fileName,
      userEmail,
      iaName,
      iaType,
      isLink = false,
      url = ''
    } = params;

    const useAnthropic = import.meta.env.VITE_RAG_USE_ANTHROPIC_CONVERT || 'False';
    const formData = new FormData();

    formData.append('filename', fileName);
    formData.append('output_path', isCommon ? 'common' : `${companyName}/${programName}`);
    formData.append('company_name', companyName);
    formData.append('program_name', programName);
    formData.append('tools_file_name', `${programName}Tools`);
    formData.append('use_anthropic_convert', useAnthropic);
    formData.append('user_email', userEmail);
    formData.append('is_common', String(isCommon));
    formData.append('ia_id', iaName);
    formData.append('ia_type', iaType);

    if (file && !isLink && file[0]) {
      formData.append('file', file[0]);
    }

    if (isLink) {
      formData.append('url', url);
      formData.append('isExtractImg', 'false');
      formData.append('isExtractFiles', 'true');
    }

    const endpoint = isLink ? RAG_ROUTE_LINK : RAG_ROUTE;
    const response = await axios.post(endpoint, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    return response.data;
  }

  /**
   * Send email to activate reset namespace
   */
  async sendEmailActivateResetNamespace(
    programName: string,
    companyName: string,
    body: string,
    subject: string
  ): Promise<any> {
    const formData = new FormData();

    formData.append('program_name', programName);
    formData.append('company_name', companyName);
    formData.append('body', body);
    formData.append('subject', subject);
    formData.append('filename', 'file');
    formData.append('recipient_email', 'admin@example.com');

    const response = await axios.post(SEND_EMAIL_RESET_NAMESPACE_RAG_ROUTE, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    return response.data;
  }

  /**
   * Reset RAG namespace
   */
  async resetRagNamespace(
    programName: string,
    companyName: string,
    iaId: string,
    iaType: string,
    catName: string,
    isCommon: boolean
  ): Promise<any> {
    const formData = new FormData();

    formData.append('program_name', programName);
    formData.append('company_name', companyName);
    formData.append('ia_id', iaId);
    formData.append('ia_type', iaType);
    formData.append('cat_name', catName);
    formData.append('is_common', String(isCommon));

    const response = await axios.post(RESET_NAMESPACE_RAG_ROUTE, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    return response.data;
  }

  /**
   * Set RAG index
   */
  async setRagIndex(params: IRagIndexParams): Promise<any> {
    const {
      isToBlockCat,
      userUuid,
      programId,
      status,
      comment,
      errorCode,
      errorMsg,
      isCommon,
      catName,
      originalFilename,
      iaType,
      link
    } = params;

    const data = {
      isToBlockCat,
      userUuid,
      programId,
      filenameToIndex: originalFilename,
      urlToIndex: link || '',
      categoryToIndex: catName,
      status,
      isCommon,
      isIaStar: iaType === 'IA_STAR',
      comment: comment || '',
      errorCode,
      errorMsg: errorMsg || ''
    };

    const response = await axiosInstance().post(SET_RAG_INDEX_ROUTE, data, {
      headers: { 'Content-Type': 'application/json' }
    });

    return response.data;
  }

  /**
   * Reset RAG index
   */
  async resetRagIndex(
    userUuid: string,
    programId: string,
    catNameStr: string,
    isToActivateResetIndex = false,
    isCommon = false
  ): Promise<any> {
    const data = {
      userUuid,
      programId,
      categoryToIndex: catNameStr,
      isIndexReseted: !isToActivateResetIndex,
      isCommon,
      isToActivateResetIndex
    };

    const response = await axiosInstance().post(RESET_RAG_INDEX_ROUTE, data, {
      headers: { 'Content-Type': 'application/json' }
    });

    return response.data;
  }

  /**
   * Get RAG index
   */
  async getRagIndex(userUuid: string, programId: string): Promise<any> {
    const response = await axiosInstance().get(GET_RAG_INDEX_ROUTE, {
      params: { userUuid, programId },
      headers: { 'Content-Type': 'application/json' }
    });

    return response.data;
  }

  /**
   * Get tokens count
   */
  async getTokensCount(
    companyName: string,
    programName: string,
    isGlobalCount: boolean,
    isCompanyCount: boolean,
    isProgramCount: boolean
  ): Promise<number> {
    const response = await axios.get(GET_RAG_TOKENS_COUNT_ROUTE, {
      params: {
        company_name: companyName,
        program_name: programName,
        is_global_count: isGlobalCount,
        is_company_count: isCompanyCount,
        is_program_count: isProgramCount
      },
      headers: { 'Content-Type': 'application/json' }
    });

    return response.data;
  }

  /**
   * Get tokens count as XLSX file
   */
  async getTokensCountXlsxFile(): Promise<Blob> {
    const response = await axios.get(GET_RAG_TOKENS_COUNT_FILE_ROUTE, {
      responseType: 'blob',
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      }
    });

    return response.data;
  }
}

export const aiRagApi = new AIRAGApi();
export default aiRagApi;
