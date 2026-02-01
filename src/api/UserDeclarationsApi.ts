// -----------------------------------------------------------------------------
// User Declarations API
// Migrated from old_app/src/api/UserDeclarationsApi.ts
// -----------------------------------------------------------------------------

import axiosInstance from '@/config/axiosConfig';
import {
  USER_DECLARATIONS_ENDPOINT,
  USER_DECLARATIONS_VALIDATE_ENDPOINT,
  NOTES_ENDPOINT,
  PROGRAMS_ENDPOINT,
  VIEW_TYPE,
} from '@/constants/api';
import {
  USER_DECLARATION_SOURCE,
  USER_DECLARATION_STATUS,
  USER_DECLARATION_STATUS_OPERATION,
} from '@/constants/api/declarations';

export interface IUserDeclarationSearchCriteria {
  platformId?: number;
  programId?: number;
  uuid?: string;
  offset?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: string;
  view?: string;
}

export interface IUserDeclaration {
  programId: number;
  dateOfEvent: Date;
  quantity: number;
  firstName?: string;
  lastName?: string;
  companyName?: string;
  customerReference?: string;
  contractReference?: string;
  productReference?: string;
  refereeReference?: string;
  additionalComments?: string;
  productId?: number;
  amount?: number;
  proofOfSale?: File;
  proofFileId?: number;
  source?: number;
}

export interface IUserDeclarationValidation {
  id: number;
  hash: string;
  operation: USER_DECLARATION_STATUS_OPERATION;
}

export interface IDeclarationNote {
  id: number;
  text: string;
  createdAt: string;
  author?: {
    firstName?: string;
    lastName?: string;
  };
}

class UserDeclarationsApi {
  /**
   * Get declarations for block widget view
   */
  async getBlockDeclarations(searchCriteria: IUserDeclarationSearchCriteria, source?: any) {
    const { data } = await axiosInstance().get(USER_DECLARATIONS_ENDPOINT, {
      params: {
        ...searchCriteria,
        view: VIEW_TYPE.BLOCK,
      },
      cancelToken: source?.token,
    });

    return data;
  }

  /**
   * Get declarations list with pagination and sorting
   */
  async getDeclarations(searchCriteria: IUserDeclarationSearchCriteria, source?: any) {
    const { data } = await axiosInstance().get(USER_DECLARATIONS_ENDPOINT, {
      params: searchCriteria,
      cancelToken: source?.token,
    });

    return data;
  }

  /**
   * Create a new declaration
   */
  async createDeclaration(declaration: IUserDeclaration): Promise<number> {
    const {
      data: { userDeclarationId },
    } = await axiosInstance().post(USER_DECLARATIONS_ENDPOINT, {
      ...declaration,
      source: USER_DECLARATION_SOURCE.FORM,
    });

    return userDeclarationId;
  }

  /**
   * Get single declaration by ID
   */
  async getDeclaration(id: number) {
    const { data } = await axiosInstance().get(`${USER_DECLARATIONS_ENDPOINT}/${id}`);

    return data;
  }

  /**
   * Get declaration form fields for a program
   */
  async getDeclarationFields(programId: number): Promise<string[]> {
    const {
      data: { resultsFormFields },
    } = await axiosInstance().get(`${PROGRAMS_ENDPOINT}/${programId}`);

    return resultsFormFields;
  }

  /**
   * Get notes for a declaration
   */
  async getNotes(userDeclarationId: number): Promise<IDeclarationNote[]> {
    const {
      data: { notes },
    } = await axiosInstance().get(NOTES_ENDPOINT, { params: { userDeclarationId } });

    return notes;
  }

  /**
   * Add a note to a declaration
   */
  async addNote(userDeclarationId: number, text: string): Promise<number> {
    const {
      data: { id },
    } = await axiosInstance().post(NOTES_ENDPOINT, { userDeclarationId, text });

    return id;
  }

  /**
   * Remove a note from a declaration
   */
  async removeNote(noteId: number): Promise<void> {
    await axiosInstance().delete(`${NOTES_ENDPOINT}/${noteId}`);
  }

  /**
   * Validate or decline a declaration
   */
  async validateDeclaration(declaration: any, newValidationStatus: USER_DECLARATION_STATUS): Promise<void> {
    const validation: IUserDeclarationValidation = {
      id: declaration.id,
      hash: declaration.hash,
      operation: this.getValidationOperation(newValidationStatus),
    };
    await axiosInstance().put(USER_DECLARATIONS_VALIDATE_ENDPOINT, { data: [validation] });
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
}

// Export singleton instance
export const userDeclarationsApi = new UserDeclarationsApi();
export default UserDeclarationsApi;
