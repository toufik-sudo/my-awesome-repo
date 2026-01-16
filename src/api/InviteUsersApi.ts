import axiosInstance from 'config/axiosConfig';
import { INVITE_USERS_EMAIL_LIST_ENDPOINT, INVITE_USERS_ENDPOINT, UPLOAD_USERS_LIST } from 'constants/api';
import { ROLE } from 'constants/security/access';
import { uploadFile } from 'store/actions/baseActions';
import { EMAIL } from 'constants/wall/users';

class InviteUserApi {
  async inviteBeneficiaryUser(payload) {
    return await axiosInstance().post(INVITE_USERS_ENDPOINT, payload);
  }

  async inviteAdminUser(inviteData) {
    return await axiosInstance().post(INVITE_USERS_EMAIL_LIST_ENDPOINT, inviteData);
  }

  sendInvitationsToLinkedEmails(payload, type, platformId, programId) {
    if (type === EMAIL) {
      return this.inviteUsersByEmailList(platformId, programId, payload);
    }
    return this.inviteAllUsers(platformId, programId);
  }

  sendInvitationsWithFile(payload, programId) {
    return this.inviteUsersByFile(programId, payload);
  }

  async inviteUsersByEmailList(platformId, programId, emails) {
    const { data } = await axiosInstance().post(INVITE_USERS_EMAIL_LIST_ENDPOINT, {
      programId,
      platformId,
      emails,
      role: ROLE.BENEFICIARY
    });

    return data.data;
  }

  async inviteAllUsers(platformId, programId) {
    const { data } = await axiosInstance().post(INVITE_USERS_ENDPOINT, {
      programId,
      platformId
    });

    return data.data;
  }

  async inviteUsersByFile(programId, { fileId, invitedUsersFile }) {
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

export default InviteUserApi;
