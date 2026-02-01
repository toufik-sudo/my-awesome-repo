// -----------------------------------------------------------------------------
// Invite Users API
// Migrated from old_app/src/api/InviteUsersApi.ts
// -----------------------------------------------------------------------------

import axiosInstance from '@/config/axiosConfig';
import { 
  INVITE_USERS_EMAIL_LIST_ENDPOINT, 
  INVITE_USERS_ENDPOINT, 
  UPLOAD_USERS_LIST 
} from '@/constants/api';
import { ROLE } from '@/constants/security/access';
import { EMAIL } from '@/constants/wall/users';
import { uploadFile } from '@/store/actions/baseActions';

class InviteUsersApi {
  async inviteBeneficiaryUser(payload: any) {
    return await axiosInstance().post(INVITE_USERS_ENDPOINT, payload);
  }

  async inviteAdminUser(inviteData: any) {
    return await axiosInstance().post(INVITE_USERS_EMAIL_LIST_ENDPOINT, inviteData);
  }

  sendInvitationsToLinkedEmails(payload: any, type: string, platformId: number, programId: number) {
    if (type === EMAIL) {
      return this.inviteUsersByEmailList(platformId, programId, payload);
    }
    return this.inviteAllUsers(platformId, programId);
  }

  sendInvitationsWithFile(payload: any, programId: number) {
    return this.inviteUsersByFile(programId, payload);
  }

  async inviteUsersByEmailList(platformId: number, programId: number, emails: string[]) {
    const { data } = await axiosInstance().post(INVITE_USERS_EMAIL_LIST_ENDPOINT, {
      programId,
      platformId,
      emails,
      role: ROLE.BENEFICIARY
    });
    return data.data;
  }

  async inviteAllUsers(platformId: number, programId: number) {
    const { data } = await axiosInstance().post(INVITE_USERS_ENDPOINT, {
      programId,
      platformId
    });
    return data.data;
  }

  async inviteUsersByFile(programId: number, { fileId, invitedUsersFile }: { fileId?: string; invitedUsersFile?: string }) {
    const { data } = await uploadFile(
      {
        invitedUsersFile: (fileId || invitedUsersFile) + '',
        programId
      },
      UPLOAD_USERS_LIST
    );
    return data.data;
  }
}

export const inviteUsersApi = new InviteUsersApi();
export default InviteUsersApi;
