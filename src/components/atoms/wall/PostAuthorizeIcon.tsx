import React from 'react';
import { useUpdatePostConfidentiality } from 'hooks/wall/confidentiality/useUpdatePostConfidentiality';
import { emptyFn } from 'utils/general';
import { AuthorizeIcon } from 'components/atoms/wall/AuthorizeIcon';

/**
 * Atom component used to show post authorize block
 * @param confidentialityType
 * @param id
 * @param selectedProgramId
 * @constructor
 */
const PostAuthorizeIcon = ({
  confidentialityType,
  id,
  postProgramId = undefined,
  openConfirmDeleteModal = emptyFn()
}) => {
  const { onOptionChanged, disabled } = useUpdatePostConfidentiality({
    id,
    postProgramId,
    openConfirmDeleteModal
  });

  return <AuthorizeIcon {...{ confidentialityType, id, disabled, onOptionChanged }} />;
};

export default PostAuthorizeIcon;
