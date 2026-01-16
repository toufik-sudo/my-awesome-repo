import { useState, useContext } from 'react';

import { POST_CONFIDENTIALITY_TYPES } from 'constants/wall/posts';
import { SpecificUsersContext } from 'components/molecules/wall/blocks/WallBaseBlock';

/**
 * Hook used to administrate the confidentiality when creating a post
 * @param selectedProgramId
 */
export const useCreatePostWithConfidentiality = selectedProgramId => {
  const { openSpecificUsersModal } = useContext(SpecificUsersContext);
  const [confidentiality, setPostConfidentiality] = useState(POST_CONFIDENTIALITY_TYPES.PROGRAM_USERS);
  const [selectedUsers, setSelectedUsers] = useState([]);

  const onChangeSelectedUsers = specificUsers => {
    if (!specificUsers.length) {
      setPostConfidentiality(POST_CONFIDENTIALITY_TYPES.PROGRAM_USERS);
    }
    setSelectedUsers(specificUsers);
  };

  const onChangeConfidentiality = option => {
    if (!option) return;
    setPostConfidentiality(option.type);
    if (option.type == POST_CONFIDENTIALITY_TYPES.SPECIFIC_PEOPLE) {
      openSpecificUsersModal(selectedProgramId, null, onChangeSelectedUsers);
    }
  };

  return { confidentiality, setPostConfidentiality, selectedUsers, onChangeConfidentiality };
};
