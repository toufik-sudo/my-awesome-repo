import { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useIntl } from 'react-intl';

import InviteUserApi from 'api/InviteUsersApi';
import { FILE, EMAIL, ALL_USERS } from 'constants/wall/users';
import { useWallSelection } from 'hooks/wall/useWallSelection';
import { IStore } from 'interfaces/store/IStore';
import { getUserAuthorizations, isAnyKindOfAdmin, isAnyKindOfManager } from 'services/security/accessServices';
import { setLinkedEmailsData } from 'store/actions/wallActions';
import { setLaunchDataStep } from 'store/actions/launchActions';
import { INVITED_USER_DATA } from 'constants/wall/launch';

const inviteUsersApi = new InviteUserApi();
/**
 * Handles user invites to program submission
 */
export const useHandleInvitesSubmission = () => {
  const payload = useSelector((store: IStore) => store.wallReducer.linkedEmailsData);
  const { invitedUserData } = useSelector((store: IStore) => store.launchReducer);
  const {
    selectedProgramId,
    selectedPlatform: { id: selectedPlatformId, role }
  } = useWallSelection();
  const { formatMessage } = useIntl();
  const [inviteError, setInviteError] = useState(false);
  const [activeTab, setActiveTab] = useState(EMAIL);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [forceRemountKey, setForceRemountKey] = useState(0);
  const userRights = useMemo(() => getUserAuthorizations(role), [role]);

  const dispatch = useDispatch();
  const isProgramValid = selectedProgramId && (isAnyKindOfAdmin(userRights) || isAnyKindOfManager(userRights));

  const sendEmailInvitations = async activeTab => {
    setIsSubmitting(true);
    try {
      await inviteUsersApi.sendInvitationsToLinkedEmails(payload, activeTab, selectedPlatformId, selectedProgramId);
      setInviteError(false);
      dispatch(setLinkedEmailsData([]));
      toast(formatMessage({ id: 'wall.send.invitation.success' }));
    } catch (e) {
      setInviteError(true);
    }
    setIsSubmitting(false);
  };

  const sendFileInvitations = async () => {
    setIsSubmitting(true);
    try {
      await inviteUsersApi.sendInvitationsWithFile(invitedUserData, selectedProgramId);
      toast(formatMessage({ id: 'wall.send.invitation.success' }));
      await dispatch(setLaunchDataStep({ key: INVITED_USER_DATA }));
      setForceRemountKey(forceRemountKey + 1);
    } catch (err) {
      setInviteError(true);
    }
    setIsSubmitting(false);
  };

  const handleSubmitInvites = activeTab => {
    if (activeTab !== FILE) {
      return sendEmailInvitations(activeTab);
    }

    if (activeTab === FILE && invitedUserData) {
      return sendFileInvitations();
    }

    setInviteError(true);
  };

  useEffect(() => {
    setInviteError(false);
  }, [activeTab]);

  const isDisabled =
    activeTab !== ALL_USERS &&
    ((activeTab !== FILE && !payload.length) ||
      (activeTab === FILE && (!invitedUserData || invitedUserData.totalInvalid === invitedUserData.totalLines)));

  return {
    handleSubmitInvites,
    inviteError,
    forceRemountKey,
    isSubmitting,
    isDisabled,
    activeTab,
    setActiveTab,
    isProgramValid
  };
};
