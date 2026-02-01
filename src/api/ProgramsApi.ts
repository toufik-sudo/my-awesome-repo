// -----------------------------------------------------------------------------
// Programs API Service
// Handles all program-related API calls
// -----------------------------------------------------------------------------

import axiosInstance from '@/config/axiosConfig';
import {
  PROGRAMS_ENDPOINT,
  AUTHORIZATION,
  WELCOME_CUSTOM
} from '@/constants/api';
import { IProgram, IProgramDetails, IPageableResult, IPaginationParams } from './types';

export interface IProgramSearchCriteria extends IPaginationParams {
  platformId?: number;
  status?: number;
  search?: string;
}

class ProgramsApi {
  /**
   * Get program details by ID
   */
  async getProgramDetails(programId: number): Promise<IProgramDetails> {
    const { data } = await axiosInstance().get(`${PROGRAMS_ENDPOINT}/${programId}`);
    return data;
  }

  /**
   * Get program details for anonymous users (no auth required)
   */
  async getAnonymousProgramDetails(programId: number): Promise<IProgramDetails> {
    const { data } = await axiosInstance(false).get(`${PROGRAMS_ENDPOINT}/${programId}`, {
      params: { view: 'anonymous' },
      headers: { [AUTHORIZATION]: '' }
    });
    return data;
  }

  /**
   * Get onboarding program details (for welcome page)
   */
  async getOnboardingProgramDetails(programId: number): Promise<IProgramDetails> {
    const { data } = await axiosInstance(false).get(`/${WELCOME_CUSTOM}`, {
      params: { programId },
      headers: { [AUTHORIZATION]: '' }
    });
    return data;
  }

  /**
   * Get list of programs with pagination
   */
  async getPrograms(searchCriteria: IProgramSearchCriteria): Promise<IPageableResult<IProgram>> {
    const { data } = await axiosInstance().get(PROGRAMS_ENDPOINT, {
      params: searchCriteria
    });

    return {
      entries: data.data || data,
      total: data.total || data.length
    };
  }

  /**
   * Get programs for a specific platform
   */
  async getPlatformPrograms(platformId: number): Promise<IProgram[]> {
    const { entries } = await this.getPrograms({ platformId });
    return entries;
  }

  /**
   * Create a new program
   */
  async createProgram(program: Partial<IProgram>): Promise<IProgram> {
    const { data } = await axiosInstance().post(PROGRAMS_ENDPOINT, program);
    return data;
  }

  /**
   * Update an existing program
   */
  async updateProgram(programId: number, updates: Partial<IProgram>): Promise<IProgram> {
    const { data } = await axiosInstance().patch(
      `${PROGRAMS_ENDPOINT}/${programId}`,
      updates
    );
    return data;
  }

  /**
   * Delete a program
   */
  async deleteProgram(programId: number): Promise<void> {
    await axiosInstance().delete(`${PROGRAMS_ENDPOINT}/${programId}`);
  }

  /**
   * Get program form fields (for declarations)
   */
  async getProgramFormFields(programId: number): Promise<string[]> {
    const { data } = await axiosInstance().get(`${PROGRAMS_ENDPOINT}/${programId}`);
    return data.resultsFormFields || [];
  }
}

// Export singleton instance
export const programsApi = new ProgramsApi();
export default ProgramsApi;
