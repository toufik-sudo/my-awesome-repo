import qs from 'qs';
import moment from 'moment';

import FilesApi from 'api/FilesApi';
import axiosInstance from 'config/axiosConfig';
import {
  USERS_ENDPOINT,
  UPDATE_PROGRAM_USER_ENDPOINT,
  VIEW_TYPE,
  PROGRAMS,
  RANKING,
  USERS,
  POINTS_ENDPOINT,
  USERS_RANKING_ENDPOINT,
  USERS_RANKINGS_DEFAULT_SORTING,
  USER_DATA_EXPORT,
  PLATFORM_ADMINISTRATORS,
  CANCEL_STRIPE_USERS_ENDPOINT
} from 'constants/api';
import {
  USER_PROGRAM_STATUS,
  DEFAULT_USERS_LIST_SIZE,
  USERS_DEFAULT_SORTING,
  DEFAULT_PROGRAMS_QUERY
} from 'constants/api/userPrograms';
import { DEFAULT_ISO_DATE_FORMAT } from 'constants/forms';
import { PLATFORM_ID_QUERY } from 'constants/routes';
import { USER_DATA_EXPORT_FILE_PARAM, USER_DATA_EXPORT_FILE_NAME } from 'constants/wall/users';
import { IUserProgramsSearchCriteria } from 'interfaces/api/IUserProgramsSearchCriteria';
import { IProgramJoinValidation } from 'interfaces/api/IProgramJoinValidation';
import { IUserSearchCriteria } from 'interfaces/api/users/IUserSearchCriteria';
import { IUserPlatformRoleUpdate } from 'interfaces/api/users/IUserPlatformRoleUpdate';
import { IManagedProgramUsers } from 'interfaces/api/users/IManagedProgramUsers';
import { IUserRankingsSearch } from 'interfaces/api/IUsersRankingsSearch';
import { IPageableResult } from 'interfaces/IPageableResult';
import { IFileDownload } from 'interfaces/api/IFileDownload';
import { IAdminProgramsSearchCriteria } from 'interfaces/api/IAdminProgramsSearchCriteria';

class UserApi {
  private filesApi;

  constructor() {
    this.filesApi = new FilesApi();
  }

  async getUsers(searchCriteria: IUserSearchCriteria): Promise<IPageableResult<any>> {
    const { data } = await axiosInstance().get(USERS_ENDPOINT, {
      params: searchCriteria,
      paramsSerializer: params =>
        qs.stringify(params, {
          arrayFormat: 'brackets',
          skipNulls: true
        })
    });

    return {
      entries: data.data,
      total: data.total
    };
  }

  async getActiveProgramUsers(platform: number, program?: number, search?: string) {
    const { entries } = await this.getUsers({
      platform,
      search,
      view: VIEW_TYPE.LIST,
      size: DEFAULT_USERS_LIST_SIZE,
      filters: {
        program,
        status: [USER_PROGRAM_STATUS.ACTIVE]
      },
      ...USERS_DEFAULT_SORTING
    });

    return entries;
  }

  async getManagedUsersCount(platform: number, program: number, managerId: number): Promise<number> {
    const { total } = await this.getUsers({
      platform,
      view: VIEW_TYPE.COUNTER,
      filters: {
        program,
        peopleManager: managerId
      }
    });

    return total || 0;
  }

  async getUserDetails(userId: string) {
    const { data } = await axiosInstance().get(`${USERS_ENDPOINT}/${userId}`);

    return data;
  }

  async updateUserDetails(userId: string, accountData: any): Promise<void> {
    let payload = accountData;
    if (accountData.dateOfBirth) {
      payload = {
        ...accountData,
        dateOfBirth: moment(accountData.dateOfBirth).format(DEFAULT_ISO_DATE_FORMAT)
      };
    }

    await axiosInstance().patch(`${USERS_ENDPOINT}/${userId}`, payload);
  }

  getProgramsGroupedByPlatform(userId: string) {
    return this.getUserPrograms({ uuid: userId });
  }

  getUserPrograms(searchCriteria: IUserProgramsSearchCriteria) {
    const url = [USERS_ENDPOINT, searchCriteria.uuid, PROGRAMS].join('/');

    return axiosInstance().get(url, {
      params: {
        ...DEFAULT_PROGRAMS_QUERY,
        ...searchCriteria
      }
    });
  }

  async getUserProgramsAsync(searchCriteria: IUserProgramsSearchCriteria) {
    const url = [USERS_ENDPOINT, searchCriteria.uuid, PROGRAMS].join('/');

    return await axiosInstance().get(url, {
      params: {
        ...DEFAULT_PROGRAMS_QUERY,
        ...searchCriteria
      }
    });
  }

  async getAdminPrograms(adminUuid: string, criteria: IAdminProgramsSearchCriteria): Promise<IPageableResult<any>> {
    const {
      data: { platforms }
    } = await axiosInstance().get(`${USERS_ENDPOINT}/${adminUuid}/admin-programs`, { params: criteria });
    const totalResults =
      platforms.length < criteria.platformsSize
        ? platforms.length + criteria.platformsOffset
        : DEFAULT_PROGRAMS_QUERY.programsSize;

    return {
      total: totalResults,
      entries: platforms
    };
  }

  getUserRankings(userId, source?) {
    return axiosInstance().get([USERS_ENDPOINT, userId, RANKING].join('/'), { cancelToken: source?.token });
  }

  async validateJoinRequest(validation: IProgramJoinValidation): Promise<void> {
    await axiosInstance().put(UPDATE_PROGRAM_USER_ENDPOINT, validation);
  }

  async joinOrDeclineProgram(validation: IProgramJoinValidation): Promise<void> {
    await axiosInstance().post(UPDATE_PROGRAM_USER_ENDPOINT, validation);
  }

  updateProgramUsers(programId: number, uuid: string, operation: string) {
    return axiosInstance().put(UPDATE_PROGRAM_USER_ENDPOINT, { programId, uuid, operation });
  }

  async setPeopleManager(managerId: string, managedProgramUsers: IManagedProgramUsers) {
    await axiosInstance().put(`${USERS_ENDPOINT}/${managerId}/manager`, managedProgramUsers);
  }

  async getAdmins(platformId: number) {
    return await axiosInstance().get(USERS_ENDPOINT, {
      params: {
        platform: platformId,
        view: VIEW_TYPE.ADMINISTRATORS
      }
    });
  }

  async updateUserPlatformRole(userUuid: string, platformRole: IUserPlatformRoleUpdate) {
    await axiosInstance().put(`${PLATFORM_ADMINISTRATORS}/${userUuid}/role`, platformRole);
  }

  getBeneficiaryPoints(userId, source?) {
    return axiosInstance().get([USERS, userId, POINTS_ENDPOINT].join('/'), {cancelToken: source?.token});
  }

  async getUsersRanking(searchCriteria: IUserRankingsSearch): Promise<IPageableResult<any>> {
    const { data } = await axiosInstance().get(USERS_RANKING_ENDPOINT, {
      params: {
        ...searchCriteria,
        ...USERS_RANKINGS_DEFAULT_SORTING
      }
    });

    return {
      entries: data.users,
      total: data.total
    };
  }

  exportUserData(userUuid: string): Promise<IFileDownload> {
    const url = [USERS_ENDPOINT, userUuid, USER_DATA_EXPORT].join('/');

    return this.filesApi.downloadFile(url, { export: USER_DATA_EXPORT_FILE_PARAM }, USER_DATA_EXPORT_FILE_NAME);
  }

  async getUserData(userUuid:String){
    const url = [USERS_ENDPOINT, userUuid, USER_DATA_EXPORT].join('/')
    return await axiosInstance().get(url);
  }

  getUserPoints(platformId) {
    return axiosInstance().get(`${POINTS_ENDPOINT}${PLATFORM_ID_QUERY}${platformId}`);
  }

  cancelStripeUserSubscription(payload) {
    const data = axiosInstance().post(`${USERS_ENDPOINT}${CANCEL_STRIPE_USERS_ENDPOINT}`, payload);
    return data;
  }
}

export default UserApi;
