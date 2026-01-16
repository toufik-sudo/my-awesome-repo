import axiosInstance from 'config/axiosConfig';
import FilesApi from 'api/FilesApi';
import envConfig from 'config/envConfig';
import {
  API_V1,
  NOTES_ENDPOINT,
  PROGRAMS_ENDPOINT,
  USER_DECLARATIONS_ENDPOINT,
  USER_DECLARATIONS_TEMPLATE_ENDPOINT,
  USER_DECLARATIONS_UPLOAD_ENDPOINT,
  USER_DECLARATIONS_VALIDATE_ENDPOINT,
  USER_GROWTH_REF_UPLOAD_ENDPOINT,
  VIEW_TYPE
} from 'constants/api';
import { IUserDeclarationSearchCriteria } from 'interfaces/api/userDeclaration/IUserDeclarationSearchCriteria';
import { IUserDeclarationValidation } from 'interfaces/api/userDeclaration/IUserDeclarationValidation';
import { IUserDeclaration } from 'interfaces/api/userDeclaration/IUserDeclaration';
import {
  DECLARATION_FILE_TYPE,
  DECLARATION_TEMPLATE_TYPE,
  USER_DECLARATION_SOURCE,
  USER_DECLARATION_STATUS,
  USER_DECLARATION_STATUS_OPERATION
} from 'constants/api/declarations';
import { trimUrl } from 'utils/api';
import { IUserDeclarationUpload } from 'interfaces/api/userDeclaration/IUserDeclarationUpload';
import { IFileDownload } from 'interfaces/api/IFileDownload';

class UserGrowthRefApi {
  private filesApi;

  constructor() {
    this.filesApi = new FilesApi();
  }

  // async getBlockDeclarations(searchCriteria: IUserDeclarationSearchCriteria, source?) {
  //   const { data } = await axiosInstance().get(USER_DECLARATIONS_ENDPOINT, {
  //     params: {
  //       ...searchCriteria,
  //       view: VIEW_TYPE.BLOCK
  //     },
  //     cancelToken: source.token
  //   });

  //   return data;
  // }

  // async getDeclarations(searchCriteria: IUserDeclarationSearchCriteria, source?) {
  //   const { data } = await axiosInstance().get(USER_DECLARATIONS_ENDPOINT, {
  //     params: searchCriteria, cancelToken: source?.token
  //   });

  //   return data;
  // }

  // async createDeclaration({ proofOfSale, ...declaration }: IUserDeclaration): Promise<number> {
  //   const proofFileId = await this.uploadProofFile(proofOfSale);
  //   const {
  //     data: { userDeclarationId }
  //   } = await axiosInstance().post(USER_DECLARATIONS_ENDPOINT, {
  //     ...declaration,
  //     proofFileId,
  //     source: USER_DECLARATION_SOURCE.FORM
  //   });

  //   return userDeclarationId;
  // }

  // async getDeclaration(id: number) {
  //   const { data } = await axiosInstance().get(`${USER_DECLARATIONS_ENDPOINT}/${id}`);

  //   return data;
  // }

  // async getDeclarationFields(programId: number): Promise<string[]> {
  //   const {
  //     data: { resultsFormFields }
  //   } = await axiosInstance().get(`${PROGRAMS_ENDPOINT}/${programId}`);

  //   return resultsFormFields;
  // }

  // async getNotes(userDeclarationId: number): Promise<any[]> {
  //   const {
  //     data: { notes }
  //   } = await axiosInstance().get(NOTES_ENDPOINT, { params: { userDeclarationId } });

  //   return notes;
  // }

  // async addNote(userDeclarationId: number, text: any): Promise<number> {
  //   const {
  //     data: { id }
  //   } = await axiosInstance().post(NOTES_ENDPOINT, { userDeclarationId, text });

  //   return id;
  // }

  // async removeNote(noteId: number): Promise<void> {
  //   await axiosInstance().delete(`${NOTES_ENDPOINT}/${noteId}`);
  // }

  // async validateDeclaration(declaration: any, newValidationStatus: USER_DECLARATION_STATUS): Promise<void> {
  //   const validation: IUserDeclarationValidation = {
  //     id: declaration.id,
  //     hash: declaration.hash,
  //     operation: this.getValidationOperation(newValidationStatus)
  //   };
  //   await axiosInstance().put(USER_DECLARATIONS_VALIDATE_ENDPOINT, { data: [validation] });
  // }

  // async getDeclarationTemplate(programId: number, templateType: DECLARATION_TEMPLATE_TYPE): Promise<IFileDownload> {
  //   const endpointUrl = `${trimUrl(envConfig.backendUrl, API_V1)}${USER_DECLARATIONS_TEMPLATE_ENDPOINT}`;
  //   const params = { program: programId, type: templateType };

  //   return this.filesApi.downloadFile(endpointUrl, params, `declaration_template.${templateType}`);
  // }

  async uploadGrowthRefFiles(growthRefFile) {
    const endpointUrl = `${trimUrl(envConfig.backendUrl, API_V1)}${USER_GROWTH_REF_UPLOAD_ENDPOINT}`;
    const { data } = await this.filesApi.uploadFileToUrl(endpointUrl, growthRefFile);

    return data;
  }

  private getValidationOperation(newValidationStatus: USER_DECLARATION_STATUS): USER_DECLARATION_STATUS_OPERATION {
    if (newValidationStatus === USER_DECLARATION_STATUS.VALIDATED) {
      return USER_DECLARATION_STATUS_OPERATION.VALIDATE;
    }

    if (newValidationStatus === USER_DECLARATION_STATUS.DECLINED) {
      return USER_DECLARATION_STATUS_OPERATION.DECLINE;
    }

    throw new Error('Validation operation not supported');
  }

  private async uploadProofFile(proofFile) {
    if (!proofFile) {
      return;
    }

    const { data } = await this.filesApi.uploadFiles([
      {
        file: proofFile,
        filename: proofFile.name,
        type: DECLARATION_FILE_TYPE.PROOF
      }
    ]);

    return data[0].id;
  }
}

export default UserGrowthRefApi;
