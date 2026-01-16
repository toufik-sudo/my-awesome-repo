import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { useIntl } from 'react-intl';

import UserApi from 'api/UsersApi';
import InviteUserApi from 'api/InviteUsersApi';
import { PLATFORM_INVITE_ROLE, PLATFORM_ROLE_OPERATION } from 'constants/api/platforms';
import { DUPLICATED_VALUE } from 'constants/forms';
import { CONFIRMATION_MODAL } from 'constants/modal';
import { ADMIN_INVITATION_DUPLICATE_ERROR_CODE, FORBIDDEN_ERROR_CODE } from 'constants/validation';
import { setModalState } from 'store/actions/modalActions';
import { isEmailValid } from 'utils/validationUtils';

/**
 *  hook used for adding/editing and removing an admin
 */
const useAdministratorsRoles = ({ id: platformId }, reloadAdministrators) => {
  const dispatch = useDispatch();
  const { formatMessage } = useIntl();

  const [showModal, setShowModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState(PLATFORM_INVITE_ROLE.ADMIN);
  const [initialSelectedRole, setInitialSelectedRole] = useState(null);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onRemoveRole = async uuid => {
    try {
      await new UserApi().updateUserPlatformRole(uuid, {
        platformId,
        operation: PLATFORM_ROLE_OPERATION.DELETE
      });
      reloadAdministrators();
    } catch (e) {
      toast(formatMessage({ id: 'toast.message.generic.error' }));
    }
  };
  const openConfirmRemoveRole = uuid => dispatch(setModalState(true, CONFIRMATION_MODAL, { selectedId: uuid }));

  const openEditRole = ({ uuid, role }) => {
    setEditingId(uuid);
    setInitialSelectedRole(role);
    setSelectedRole(role);
    setShowModal(true);
  };

  const validateInvitation = async () => {
    if (!isEmailValid(email, setError)) {
      return false;
    }

    try {
      await new InviteUserApi().inviteAdminUser({ platformId, role: selectedRole, emails: [email] });
      toast(formatMessage({ id: 'toast.inviteAdmin.create.success' }));

      return true;
    } catch ({ response }) {
      if (response && response.data && response.data.code === ADMIN_INVITATION_DUPLICATE_ERROR_CODE) {
        toast(formatMessage({ id: 'toast.inviteAdmin.create.duplicateEmail' }));
      } else if (response && response.data && response.data.code === FORBIDDEN_ERROR_CODE) {
        toast(formatMessage({ id: 'toast.inviteAdmin.create.duplicateEmail.' + selectedRole }));
      } else {
        toast(formatMessage({ id: 'toast.message.generic.error' }));
      }
    }

    return false;
  };

  const updateRole = async () => {
    await new UserApi().updateUserPlatformRole(editingId, {
      platformId,
      role: selectedRole,
      operation: PLATFORM_ROLE_OPERATION.UPDATE
    });

    return true;
  };

  const onValidate = async () => {
    setIsSubmitting(true);
    try {
      if (await (editingId ? updateRole() : validateInvitation())) {
        closeModal();
        reloadAdministrators();
      }
    } catch ({ response }) {
      if (response && response.data && response.data.code === DUPLICATED_VALUE) {
        setIsSubmitting(false);
        return setError('form.validation.userIsBeneficiary');
      }
      toast(formatMessage({ id: 'toast.message.generic.error' }));
    }
    setIsSubmitting(false);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(undefined);
    setEmail('');
    setError('');
    setSelectedRole(PLATFORM_INVITE_ROLE.ADMIN);
    setInitialSelectedRole(null);
  };

  return {
    onRemoveRole,
    error,
    openConfirmRemoveRole,
    showModal,
    closeModal,
    initialSelectedRole,
    setShowModal,
    selectedRole,
    setSelectedRole,
    email,
    setEmail,
    openEditRole,
    isSubmitting,
    onValidate,
    editingId
  };
};

export default useAdministratorsRoles;
