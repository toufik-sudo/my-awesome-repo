import { useHistory } from 'react-router-dom';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { useIntl } from 'react-intl';

import CommunicationsApi from 'api/CommunicationsApi';

const communicationsApi = new CommunicationsApi();

/**
 * Uses the {currentEditableUserListId} to retrieve the corresponding email user list and then sets the received data
 * Also it disables program selection process
 *
 * @param currentEditableUserListId
 * @param setForcedEditProgramId
 * @param setSelectedUserIds
 * @param setUserListName
 * @param intl
 */
const useOnLoadEditableUserList = ({
  currentEditableUserListId,
  setForcedEditProgramId,
  setSelectedUserIds,
  setUserListName
}) => {
  const history = useHistory();
  const { formatMessage } = useIntl();

  useEffect(() => {
    if (!currentEditableUserListId) {
      return;
    }

    communicationsApi
      .getEmailUserListData(currentEditableUserListId, {})
      .then(({ data: { users, name, program } }) => {
        setForcedEditProgramId(program.id);
        setSelectedUserIds(users.map(user => user.id));
        setUserListName(name);
      })
      .catch(() => {
        history.goBack();
        toast(formatMessage({ id: 'toast.message.generic.error' }));
      });
  }, []);
};
export default useOnLoadEditableUserList;
