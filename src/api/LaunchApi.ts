// -----------------------------------------------------------------------------
// Launch API
// Migrated from old_app/src/api/LaunchApi.ts
// -----------------------------------------------------------------------------

import axiosInstance from '@/config/axiosConfig';
import { 
  CATEGORIES, 
  POSSIBLE_ALLOCATION_TYPES, 
  PROGRAMS_ENDPOINT, 
  UPDATE_PROGRAMS_ENDPOINT 
} from '@/constants/api';
import type { ICategorySearch } from '@/api/types';

class LaunchApi {
  async getPossibleAllocationTypes(payload: any) {
    const {
      data: { goals: acceptedAllocationTypes }
    } = await axiosInstance().post(POSSIBLE_ALLOCATION_TYPES, payload);
    return acceptedAllocationTypes;
  }

  async getCategories(params: ICategorySearch) {
    const { data } = await axiosInstance().get(CATEGORIES, { params });
    return data;
  }

  launchProgram(payload: any) {
    return axiosInstance().post(PROGRAMS_ENDPOINT, payload);
  }

  updateProgram(payload: any) {
    return axiosInstance().post(`${UPDATE_PROGRAMS_ENDPOINT}`, payload);
  }
}

export const launchApi = new LaunchApi();
export default LaunchApi;
