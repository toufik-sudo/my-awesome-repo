import axios from "axios";
import axiosInstance from "config/axiosConfig";
import { GET_IA_API, GET_IA_PERSO_API, SET_UPDATE_IA_PERSO_API } from "constants/api";

class AiPersoApi {
  async getIaPersoCompany(params?) {
    try {
      const response = await axiosInstance().get(GET_IA_PERSO_API, {
        params: params,
      });

      return response.data;
    } catch (error) {
      console.error("Error uploading files:", error);
      throw error;
    }
  }
  async getIaCompany(params?) {
    try {
      const response = await axiosInstance().get(GET_IA_API, {
        params: params,
      });

      return response.data;
    } catch (error) {
      console.error("Error getting iaCompany data:", error);
      throw error;
    }
  }
  async setOrUpdateIaPersoCompany(payload) {
    try {
      const response = await axiosInstance().post(
        SET_UPDATE_IA_PERSO_API,
        payload
      );

      return response.data;
    } catch (error) {
      console.error("Error uploading files:", error);
      throw error;
    }
  }
}

export default new AiPersoApi();
