import { useHistory } from 'react-router-dom';
import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { useIntl } from 'react-intl';

import CommunicationsApi from 'api/CommunicationsApi';
import { WALL_COMMUNICATION_USER_LIST_ROUTE } from 'constants/routes';
import { validatedUserListForm } from 'services/communications/EmailUserListService';

const communicationsApi = new CommunicationsApi();

/**
 * Uses selected programId and current userList id to edit/save a user list
 *
 * @param programId
 * @param users
 * @param currentEditableUserListId
 */
const useUserListForm = ({ programId, users, currentEditableUserListId }) => {
  const history = useHistory();
  const { formatMessage } = useIntl();

  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [userListName, setUserListName] = useState('');
  const [errors, setErrors] = useState({ name: '', users: '' });

  const onSaveUserList = useCallback(() => {
    if (isSaving || !validatedUserListForm(setErrors, userListName, selectedUserIds)) {
      return;
    }
    setIsSaving(true);
    const args = { payload: { programId, users: selectedUserIds, name: userListName }, currentEditableUserListId };
    const request: any = currentEditableUserListId ? communicationsApi.editUserList : communicationsApi.saveUserList;
    const currentAction = currentEditableUserListId ? 'edit' : 'create';

    request(args)
      .then(() => {
        history.push(WALL_COMMUNICATION_USER_LIST_ROUTE);
        toast(formatMessage({ id: `toast.communications.userList.${currentAction}.success` }));
      })
      .catch(() => toast(formatMessage({ id: 'toast.message.generic.error' })))
      .finally(() => setIsSaving(false));
  }, [programId, selectedUserIds, userListName, setErrors, isSaving, setIsSaving]);

  const toggleUserSelected = useCallback(
    selectedId => {
      if (selectedUserIds.indexOf(selectedId) >= 0) {
        const newSelectedUsers = selectedUserIds.filter(id => selectedId !== id);
        return setSelectedUserIds(newSelectedUsers);
      }
      setSelectedUserIds([...selectedUserIds, selectedId]);
    },
    [selectedUserIds]
  );

  return {
    users,
    isSaving,
    selectedUserIds,
    setSelectedUserIds,
    userListName,
    setUserListName,
    errors,
    onSaveUserList,
    toggleUserSelected
  };
};

export default useUserListForm;
