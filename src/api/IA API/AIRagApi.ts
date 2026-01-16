import axios from 'axios';
import axiosInstance from 'config/axiosConfig';
import { GET_RAG_INDEX_ROUTE, GET_RAG_TOKENS_COUNT_FILE_ROUTE, GET_RAG_TOKENS_COUNT_ROUTE, RAG_ROUTE, RAG_ROUTE_LINK, RESET_NAMESPACE_RAG_ROUTE, RESET_RAG_INDEX_ROUTE, SEND_EMAIL_RESET_NAMESPACE_RAG_ROUTE, SET_RAG_INDEX_ROUTE } from 'constants/routes';

class AIRAGApi {
  async uploadFiles(file, companyName, programName, isCommon, fileName, userEmail, iaName, iaType, isLink = false, url = '') {
    const formData = new FormData();
    const useAnthopic = process.env.REACT_APP_RAG_USE_ANTHROPIC_CONVERT || 'False';

    formData.append('filename', fileName);
    formData.append('output_path', isCommon ? `common` : `${companyName}/${programName}`);
    formData.append('company_name', companyName);
    formData.append('program_name', programName);
    formData.append('tools_file_name', `${programName}Tools`);
    formData.append('use_anthropic_convert', useAnthopic);
    formData.append('user_email', userEmail);
    formData.append('is_common', isCommon);
    formData.append('ia_id', iaName);
    formData.append('ia_type', iaType);

    if (file && !isLink) {
      formData.append('file', file[0]);
    }

    if (isLink) {
      formData.append('url', url);
      formData.append('isExtractImg', 'false');
      formData.append('isExtractFiles', 'true');
    }


    try {
      const urlParam = isLink ? RAG_ROUTE_LINK : RAG_ROUTE;
      const response = await axios.post(urlParam, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error uploading files:', error);
      throw error;
    }
  }

  async sendEmailActivateResetNamespace(programName, companyName, body, subject) {
    const formData = new FormData();   

    formData.append('program_name', programName);
    formData.append('company_name', companyName);
    formData.append('body', body);
    formData.append('subject', subject);
    formData.append('filename', 'file');
    formData.append('recipient_email', 'toufik@rewardzai.com');
    try {
      const urlParam = SEND_EMAIL_RESET_NAMESPACE_RAG_ROUTE;
      const response = await axios.post(urlParam, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error uploading files:', error);
      throw error;
    }
  }

  async resetRagNamespace(programName, companyName, iaId, iaType, catName, isCommon) {
    const formData = new FormData();   

    formData.append('program_name', programName);
    formData.append('company_name', companyName);
    formData.append('ia_id', iaId);
    formData.append('ia_type', iaType);
    formData.append('cat_name', catName);
    formData.append('is_common', isCommon);
    try {
      const urlParam = RESET_NAMESPACE_RAG_ROUTE;
      const response = await axios.post(urlParam, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error uploading files:', error);
      throw error;
    }
  }

  async setRagIndex(isToBlockCat, userUuid, programId, status, comment, errorCode, errorMsg, isCommon, catName, originalFilename, iaType, link) {
    try {
      const data = {
        isToBlockCat: isToBlockCat,
        userUuid: userUuid,
        programId: programId,
        filenameToIndex: originalFilename,
        urlToIndex: link || '',
        categoryToIndex: catName,
        status: status,
        isCommon: isCommon,
        isIaStar: iaType == 'IA_STAR' ? true : false,
        comment: comment || '',
        errorCode: errorCode,
        errorMsg: errorMsg || ''
      };

      const url = `${SET_RAG_INDEX_ROUTE}`;
      const response = await axiosInstance().post(url, data, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      return response.data;

    } catch (error) {
      console.error('Error fetching files:', error);
      throw error;
    }
  }

  async resetRagIndex(userUuid, programId, catNameStr, isToActivateResetIndex = false, isCommon = false) {
    try {
      const data = {
        userUuid: userUuid,
        programId: programId,
        categoryToIndex: catNameStr,
        isIndexReseted: !isToActivateResetIndex,
        isCommon: isCommon,
        isToActivateResetIndex: isToActivateResetIndex
      };

      const url = `${RESET_RAG_INDEX_ROUTE}`;
      const response = await axiosInstance().post(url, data, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      return response.data;

    } catch (error) {
      console.error('Error fetching files:', error);
      throw error;
    }
  }

  async getRagIndex(userUuid, programId) {
    try {
      const params = {
        userUuid: userUuid,
        programId: programId
      };

      const url = `${GET_RAG_INDEX_ROUTE}`;
      const response = await axiosInstance().get(url, {
        params: params,
        headers: {
          'Content-Type': 'application/json',
        }
      });

      return response.data;

    } catch (error) {
      console.error('Error fetching files:', error);
      throw error;
    }
  }
  async getTokensCount(companyName, programName, isGlobalCount, isCompanyCount, isProgramCount, isPlatformCount = false) {
    try {
      const params = {
        company_name: companyName,
        program_name: programName,
        is_global_count: isGlobalCount,
        is_company_count: isCompanyCount,
        is_program_count: isProgramCount,
      };

      const url = `${GET_RAG_TOKENS_COUNT_ROUTE}`;
      const response = await axios.get(url, {
        params: params,
        headers: {
          'Content-Type': 'application/json',
        }
      });

      return response.data;

    } catch (error) {
      console.error('Error fetching files:', error);
      throw error;
    }
  }
  async getTokensCountXlsxFile() {
    try {
      // const params = {
      //   is_global_count: isGlobalCount,
      //   is_company_count: false,
      //   is_program_count: false,
      //   is_file_count: false,
      // };

      const url = `${GET_RAG_TOKENS_COUNT_FILE_ROUTE}`;
      const response = await axios.get(url, {
        responseType: 'blob',
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        }
      });

      return response.data;

    } catch (error) {
      console.error('Error fetching files:', error);
      throw error;
    }
  }
}

export default new AIRAGApi();
