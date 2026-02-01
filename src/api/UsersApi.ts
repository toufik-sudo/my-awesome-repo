// -----------------------------------------------------------------------------
// Users API Service
// Handles all user-related API calls
// -----------------------------------------------------------------------------

import axiosInstance from '@/config/axiosConfig';
import {
  USERS_ENDPOINT,
  UPDATE_PROGRAM_USER_ENDPOINT,
  VIEW_TYPE,
  PROGRAMS,
  RANKING,
  USERS,
  POINTS_ENDPOINT,
  USERS_RANKING_ENDPOINT,
  USER_DATA_EXPORT,
  PLATFORM_ADMINISTRATORS,
  CANCEL_STRIPE_USERS_ENDPOINT,
  DEFAULT_USERS_LIST_SIZE
} from '@/constants/api';
import {
  IUser,
  IUserDetails,
  IUserSearchCriteria,
  IPageableResult,
  IUserRanking,
  IRankingSearchCriteria
} from './types';

// Default sorting for user queries
const USERS_DEFAULT_SORTING = {
  sortBy: 'createdAt',
  sortDirection: 'DESC' as const
};

const USERS_RANKINGS_DEFAULT_SORTING = {
  sortBy: 'points',
  sortDirection: 'DESC' as const
};

class UsersApi {
  /**
   * Get paginated list of users
   */
  async getUsers(searchCriteria: IUserSearchCriteria): Promise<IPageableResult<IUser>> {
    const { data } = await axiosInstance().get(USERS_ENDPOINT, {
      params: searchCriteria
    });

    return {
      entries: data.data || data,
      total: data.total || data.length
    };
  }

  /**
   * Get active users for a program
   */
  async getActiveProgramUsers(
    platformId: number,
    programId?: number,
    search?: string
  ): Promise<IUser[]> {
    const { entries } = await this.getUsers({
      platform: platformId,
      search,
      view: VIEW_TYPE.LIST,
      size: DEFAULT_USERS_LIST_SIZE,
      filters: {
        program: programId,
        status: [1] // Active status
      },
      ...USERS_DEFAULT_SORTING
    });

    return entries;
  }

  /**
   * Get count of users managed by a specific manager
   */
  async getManagedUsersCount(
    platformId: number,
    programId: number,
    managerId: number
  ): Promise<number> {
    const { total } = await this.getUsers({
      platform: platformId,
      view: VIEW_TYPE.COUNTER,
      filters: {
        program: programId,
        peopleManager: managerId
      }
    });

    return total || 0;
  }

  /**
   * Get user details by ID
   */
  async getUserDetails(userId: string): Promise<IUserDetails> {
    const { data } = await axiosInstance().get(`${USERS_ENDPOINT}/${userId}`);
    return data;
  }

  /**
   * Update user details
   */
  async updateUserDetails(userId: string, accountData: Partial<IUser>): Promise<void> {
    await axiosInstance().patch(`${USERS_ENDPOINT}/${userId}`, accountData);
  }

  /**
   * Get user's programs grouped by platform
   */
  async getUserPrograms(userId: string, params?: Record<string, unknown>) {
    const url = `${USERS_ENDPOINT}/${userId}/${PROGRAMS}`;
    const { data } = await axiosInstance().get(url, { params });
    return data;
  }

  /**
   * Get admin programs - returns platforms and programs for admin users
   * Used for Admin, Super Admin, and Hyper Admin roles
   */
  async getAdminPrograms(
    adminUuid: string,
    criteria: { platformsSize?: number; platformsOffset?: number } = {}
  ) {
    const { platformsSize = 200, platformsOffset = 0 } = criteria;
    const { data } = await axiosInstance().get(
      `${USERS_ENDPOINT}/${adminUuid}/admin-programs`,
      { params: { platformsSize, platformsOffset } }
    );
    
    return {
      platforms: data.platforms || [],
      total: data.platforms?.length || 0
    };
  }

  /**
   * Get user rankings for a specific user
   */
  async getUserRankings(userId: string): Promise<IUserRanking[]> {
    const { data } = await axiosInstance().get(`${USERS_ENDPOINT}/${userId}/${RANKING}`);
    return data;
  }

  /**
   * Validate or decline program join request
   */
  async validateJoinRequest(validation: {
    programId: number;
    uuid: string;
    operation: string;
  }): Promise<void> {
    await axiosInstance().put(UPDATE_PROGRAM_USER_ENDPOINT, validation);
  }

  /**
   * Join or decline a program
   */
  async joinOrDeclineProgram(validation: {
    programId: number;
    uuid: string;
    operation: string;
  }): Promise<void> {
    await axiosInstance().post(UPDATE_PROGRAM_USER_ENDPOINT, validation);
  }

  /**
   * Update program user status
   */
  async updateProgramUser(
    programId: number,
    uuid: string,
    operation: string
  ): Promise<void> {
    await axiosInstance().put(UPDATE_PROGRAM_USER_ENDPOINT, {
      programId,
      uuid,
      operation
    });
  }

  /**
   * Get platform administrators
   */
  async getAdmins(platformId: number): Promise<IUser[]> {
    const { data } = await axiosInstance().get(USERS_ENDPOINT, {
      params: {
        platform: platformId,
        view: VIEW_TYPE.ADMINISTRATORS
      }
    });
    return data.data || data;
  }

  /**
   * Update user's platform role
   */
  async updateUserPlatformRole(
    userUuid: string,
    platformRole: { platformId: number; role: number; operation?: string }
  ): Promise<void> {
    await axiosInstance().put(
      `${PLATFORM_ADMINISTRATORS}/${userUuid}/role`,
      platformRole
    );
  }

  /**
   * Get beneficiary points
   */
  async getBeneficiaryPoints(userId: string): Promise<number> {
    const { data } = await axiosInstance().get(`${USERS}/${userId}/${POINTS_ENDPOINT}`);
    return data.points || 0;
  }

  /**
   * Get users ranking with pagination
   */
  async getUsersRanking(
    searchCriteria: IRankingSearchCriteria
  ): Promise<IPageableResult<IUserRanking>> {
    const { data } = await axiosInstance().get(USERS_RANKING_ENDPOINT, {
      params: {
        ...searchCriteria,
        ...USERS_RANKINGS_DEFAULT_SORTING
      }
    });

    return {
      entries: data.users || data,
      total: data.total || data.length
    };
  }

  /**
   * Export user data (GDPR)
   */
  async exportUserData(userUuid: string): Promise<Blob> {
    const url = `${USERS_ENDPOINT}/${userUuid}/${USER_DATA_EXPORT}`;
    const { data } = await axiosInstance().get(url, {
      responseType: 'blob'
    });
    return data;
  }

  /**
   * Cancel user's Stripe subscription
   */
  async cancelStripeSubscription(payload: {
    userId: string;
    subscriptionId: string;
  }): Promise<void> {
    await axiosInstance().post(
      `${USERS_ENDPOINT}${CANCEL_STRIPE_USERS_ENDPOINT}`,
      payload
    );
  }
}

// Export singleton instance
export const usersApi = new UsersApi();
export default UsersApi;
