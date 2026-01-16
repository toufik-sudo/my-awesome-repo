import axiosInstance from 'config/axiosConfig';
import { AUTHORIZATION, PROGRAMS, WELCOME_CUSTOM } from 'constants/api';

class ProgramsApi {
  getProgramDetails = async (programId: number) => {
    const { data } = await axiosInstance().get(`/${PROGRAMS}/${programId}`);

    return data;
  };

  getAnonymousProgramDetails = async (programId: number) => {
    const { data } = await axiosInstance().get(`/${PROGRAMS}/${programId}`, {
      params: { view: 'anonymous' },
      headers: { [AUTHORIZATION]: '' }
    });

    return data;
  };

  getOnboardingProgramDetails = async (programId: number) => {
    const { data } = await axiosInstance().get(`/${WELCOME_CUSTOM}`, {
      params: { programId: programId },
      headers: { [AUTHORIZATION]: '' }
    });

    return data;
  };
}

export default ProgramsApi;
