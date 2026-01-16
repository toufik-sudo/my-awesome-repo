import React from 'react';
import { useDispatch } from 'react-redux';

import { setModalState } from 'store/actions/modalActions';
import { IMAGE_UPLOAD_MODAL } from 'constants/modal';
import { IMAGES_ALT } from 'constants/general';
import { useParams } from 'react-router-dom';
import { CONTENTS } from 'constants/wall/launch';

/**
 * Atom component used to render contents selection preview
 *
 * @param croppedAvatar
 * @param className
 * @constructor
 */
const ContentsSelectionPreview = ({ croppedAvatar, className = '' }) => {
  const dispatch = useDispatch();
  const { step, stepIndex } = useParams();
  const width: any = step == CONTENTS && stepIndex == 1 ? 600 : step == CONTENTS ? 330 : '100%';
  const height: any = step == CONTENTS && stepIndex == 1 ? 155 : step == CONTENTS ? 120 : '100%';

  return (
    <div>
      <img
        onClick={() => dispatch(setModalState(true, IMAGE_UPLOAD_MODAL))}
        src={croppedAvatar}
        alt={IMAGES_ALT.COVER_IMAGE}
        width={width}
        height={height}
      />
    </div>
  );
};

export default ContentsSelectionPreview;
