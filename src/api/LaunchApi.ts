import axiosInstance from 'config/axiosConfig';
import { CATEGORIES, POSSIBLE_ALLOCATION_TYPES, PROGRAMS_ENDPOINT, UPDATE_PROGRAMS_ENDPOINT } from 'constants/api';
import { ICategorySearch } from 'interfaces/api/ICategorySearch';

class LaunchApi {
  async getPossibleAllocationTypes(payload) {
    const {
      data: { goals: acceptedAllocationTypes }
    } = await axiosInstance().post(POSSIBLE_ALLOCATION_TYPES, payload);

    return acceptedAllocationTypes;
  }

  async getCategories(params: ICategorySearch) {
    const { data } = await axiosInstance().get(CATEGORIES, { params });

    return data;
  }

  launchProgram(payload) {
    return axiosInstance().post(PROGRAMS_ENDPOINT, payload);
  }
  
  updateProgram(payload) {
    return axiosInstance().post(`${UPDATE_PROGRAMS_ENDPOINT}`, payload);
  }
}

export default LaunchApi;
