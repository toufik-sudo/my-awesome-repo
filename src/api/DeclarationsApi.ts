// -----------------------------------------------------------------------------
// Declarations API Service
// Handles all declaration-related API calls
// -----------------------------------------------------------------------------

import axiosInstance from '@/config/axiosConfig';
import {
  USER_DECLARATIONS_ENDPOINT,
  USER_DECLARATIONS_VALIDATE_ENDPOINT,
  NOTES_ENDPOINT,
  VIEW_TYPE
} from '@/constants/api';
import {
  IDeclaration,
  IDeclarationSearchCriteria,
  IDeclarationValidation,
  IDeclarationCreate,
  INote,
  IPageableResult,
  DeclarationStatus,
  DeclarationStatusOperation
} from './types';
import { filesApi } from './FilesApi';

// Declaration file type for proof uploads
const DECLARATION_FILE_TYPE = {
  PROOF: 5
};

// Declaration source
const USER_DECLARATION_SOURCE = {
  FORM: 1,
  IMPORT: 2
};

class DeclarationsApi {
  /**
   * Get declarations with block view (grouped)
   */
  async getBlockDeclarations(
    searchCriteria: IDeclarationSearchCriteria
  ): Promise<IDeclaration[]> {
    const { data } = await axiosInstance().get(USER_DECLARATIONS_ENDPOINT, {
      params: {
        ...searchCriteria,
        view: VIEW_TYPE.BLOCK
      }
    });
    return data.data || data;
  }

  /**
   * Get declarations with pagination
   */
  async getDeclarations(
    searchCriteria: IDeclarationSearchCriteria
  ): Promise<IPageableResult<IDeclaration>> {
    const { data } = await axiosInstance().get(USER_DECLARATIONS_ENDPOINT, {
      params: searchCriteria
    });

    return {
      entries: data.data || data,
      total: data.total || data.length
    };
  }

  /**
   * Get a single declaration by ID
   */
  async getDeclaration(id: number): Promise<IDeclaration> {
    const { data } = await axiosInstance().get(`${USER_DECLARATIONS_ENDPOINT}/${id}`);
    return data;
  }

  /**
   * Create a new declaration
   */
  async createDeclaration(declaration: IDeclarationCreate): Promise<number> {
    let proofFileId: number | undefined;

    // Upload proof file if provided
    if (declaration.proofOfSale) {
      proofFileId = await this.uploadProofFile(declaration.proofOfSale);
    }

    const { data } = await axiosInstance().post(USER_DECLARATIONS_ENDPOINT, {
      programId: declaration.programId,
      data: declaration.data,
      proofFileId,
      source: USER_DECLARATION_SOURCE.FORM
    });

    return data.userDeclarationId;
  }

  /**
   * Validate or decline a declaration
   */
  async validateDeclaration(
    declaration: { id: number; hash: string },
    newStatus: DeclarationStatus
  ): Promise<void> {
    const validation: IDeclarationValidation = {
      id: declaration.id,
      hash: declaration.hash,
      operation: this.getValidationOperation(newStatus)
    };

    await axiosInstance().put(USER_DECLARATIONS_VALIDATE_ENDPOINT, {
      data: [validation]
    });
  }

  /**
   * Batch validate/decline multiple declarations
   */
  async batchValidateDeclarations(
    validations: IDeclarationValidation[]
  ): Promise<void> {
    await axiosInstance().put(USER_DECLARATIONS_VALIDATE_ENDPOINT, {
      data: validations
    });
  }

  /**
   * Get notes for a declaration
   */
  async getNotes(userDeclarationId: number): Promise<INote[]> {
    const { data } = await axiosInstance().get(NOTES_ENDPOINT, {
      params: { userDeclarationId }
    });
    return data.notes || data;
  }

  /**
   * Add a note to a declaration
   */
  async addNote(userDeclarationId: number, text: string): Promise<number> {
    const { data } = await axiosInstance().post(NOTES_ENDPOINT, {
      userDeclarationId,
      text
    });
    return data.id;
  }

  /**
   * Remove a note
   */
  async removeNote(noteId: number): Promise<void> {
    await axiosInstance().delete(`${NOTES_ENDPOINT}/${noteId}`);
  }

  /**
   * Get declarations for current user (beneficiary view)
   */
  async getMyDeclarations(
    userId: string,
    params?: Partial<IDeclarationSearchCriteria>
  ): Promise<IPageableResult<IDeclaration>> {
    return this.getDeclarations({
      user: userId,
      ...params
    });
  }

  /**
   * Get pending declarations count
   */
  async getPendingCount(platformId: number, programId?: number): Promise<number> {
    const { total } = await this.getDeclarations({
      platform: platformId,
      program: programId,
      status: [DeclarationStatus.PENDING],
      view: VIEW_TYPE.COUNTER
    });
    return total;
  }

  /**
   * Convert status to operation string
   */
  private getValidationOperation(status: DeclarationStatus): DeclarationStatusOperation {
    if (status === DeclarationStatus.VALIDATED) {
      return DeclarationStatusOperation.VALIDATE;
    }
    if (status === DeclarationStatus.DECLINED) {
      return DeclarationStatusOperation.DECLINE;
    }
    throw new Error('Invalid validation operation');
  }

  /**
   * Upload proof file and return file ID
   */
  private async uploadProofFile(file: File): Promise<number> {
    const uploadedFiles = await filesApi.uploadFiles([
      {
        file,
        filename: file.name,
        type: DECLARATION_FILE_TYPE.PROOF
      }
    ]);
    return uploadedFiles[0].id;
  }
}

// Export singleton instance
export const declarationsApi = new DeclarationsApi();
export default DeclarationsApi;
