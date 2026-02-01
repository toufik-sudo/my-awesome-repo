// -----------------------------------------------------------------------------
// Platforms API Service
// Handles all platform-related API calls
// -----------------------------------------------------------------------------

import axiosInstance from '@/config/axiosConfig';
import { PLATFORMS, PRICING_GET_ENDPOINT } from '@/constants/api';
import { IPlatform, IPlatformType, IPageableResult, IPaginationParams } from './types';

export interface IPlatformSearchCriteria extends IPaginationParams {
  name?: string;
  type?: number;
}

class PlatformsApi {
  /**
   * Get available platform types (for pricing page)
   */
  async getPlatformTypes(): Promise<IPlatformType[]> {
    const { data } = await axiosInstance().get(PRICING_GET_ENDPOINT);
    return data;
  }

  /**
   * Create a new platform
   */
  async createPlatform(platform: Partial<IPlatform>): Promise<IPlatform> {
    const { data } = await axiosInstance().post(PLATFORMS, platform);
    return data;
  }

  /**
   * Check if platform name is unique
   */
  async isNameUnique(name: string, currentPlatformId?: number): Promise<boolean> {
    const { data } = await axiosInstance().get(PLATFORMS, {
      params: { name }
    });

    // Name is unique if no platforms found or only the current platform has this name
    return data.length < 1 || (currentPlatformId && data[0]?.id === currentPlatformId);
  }

  /**
   * Get platform details by ID
   */
  async getPlatformDetails(platformId: string | number): Promise<IPlatform> {
    const { data } = await axiosInstance().get(`${PLATFORMS}/${platformId}`);
    return data;
  }

  /**
   * Update platform
   */
  async updatePlatform(
    platformId: number,
    updates: Partial<IPlatform>
  ): Promise<IPlatform> {
    const { data } = await axiosInstance().patch(`${PLATFORMS}/${platformId}`, updates);
    return data;
  }

  /**
   * Get list of platforms with pagination
   */
  async getPlatforms(
    searchCriteria?: IPlatformSearchCriteria
  ): Promise<IPageableResult<IPlatform>> {
    const { data } = await axiosInstance().get(PLATFORMS, {
      params: searchCriteria
    });

    return {
      entries: data.data || data,
      total: data.total || data.length
    };
  }

  /**
   * Delete a platform
   */
  async deletePlatform(platformId: number): Promise<void> {
    await axiosInstance().delete(`${PLATFORMS}/${platformId}`);
  }
}

// Export singleton instance
export const platformsApi = new PlatformsApi();
export default PlatformsApi;
