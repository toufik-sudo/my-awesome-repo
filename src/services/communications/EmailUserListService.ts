import { toast } from 'react-toastify';

import { setModalState } from 'store/actions/modalActions';
import { CONFIRMATION_MODAL } from 'constants/modal';
import CommunicationsApi from 'api/CommunicationsApi';
import { INPUT_LENGTH } from 'constants/validation';

const communicationsApi = new CommunicationsApi();

/**
 * Sets up the method used for deleting the selectedUserList
 *
 * @param formatMessage
 * @param onDeleteSuccess
 */
export const setupOnDeleteUserList = (formatMessage, onDeleteSuccess) => async selectedUserList => {
  if (!selectedUserList) {
    return toast(formatMessage({ id: 'toast.message.generic.error' }));
  }

  try {
    await communicationsApi.deleteUser(selectedUserList);
    onDeleteSuccess && onDeleteSuccess();
  } catch (e) {
    toast(formatMessage({ id: 'toast.message.generic.error' }));
  }
};

/**
 * Sets up the method used for triggering the delete confirmation modal to show
 *
 * @param formatMessage
 * @param dispatch
 */
export const setupOpenDeleteUserListModal = (formatMessage, dispatch) => selectedId => {
  if (!selectedId) {
    return toast(formatMessage({ id: 'toast.message.generic.error' }));
  }
  dispatch(setModalState(true, CONFIRMATION_MODAL, { selectedId }));
};

/**
 * Validates and sets errors for create/edit user list
 *
 * @param setErrors
 * @param userListName
 * @param selectedUserIds
 */
export const validatedUserListForm = (setErrors, userListName: string, selectedUserIds: any[]) => {
  const errors: any = {};
  if (!selectedUserIds.length) {
    errors.users = 'communication.userList.create.selectedEmails.error';
  }
  if (userListName.trim().length < INPUT_LENGTH.MIN) {
    errors.name = 'form.validation.min';
  }
  if (userListName.length === 0) {
    errors.name = 'form.validation.required';
  }
  if (userListName.length > INPUT_LENGTH.MAX) {
    errors.name = 'form.validation.max';
  }
  if (Object.keys(errors).length > 0) {
    setErrors(errors);
    return false;
  }
  return true;
};
