import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle, faCheckCircle } from '@fortawesome/free-solid-svg-icons';

import Loading from 'components/atoms/ui/Loading';
import { LOADER_TYPE } from 'constants/general';
import { emptyFn } from 'utils/general';
import { PROGRAM_JOIN_OPERATION } from 'constants/api/userPrograms';

import style from 'sass-boilerplate/stylesheets/components/wall/WallUserDetails.module.scss';
import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';

/**
 * component used to handle user invitation validation
 * @param programId
 * @param actionHandlers
 * @constructor
 */
const ProgramJoinValidationControls = ({ programId, isValidating, ...actions }) => {
  const { userDetailsDanger, userDetailsSmIcon } = style;
  const { confirmJoinAction = emptyFn } = actions;

  if (isValidating) {
    return <Loading type={LOADER_TYPE.DROPZONE} />;
  }

  return (
    <>
      <FontAwesomeIcon
        className={`${coreStyle.withPrimaryColor} ${userDetailsSmIcon} ${coreStyle.mx2}`}
        icon={faCheckCircle}
        onClick={() => confirmJoinAction({ operation: PROGRAM_JOIN_OPERATION.ACCEPT, programId })}
      />
      <FontAwesomeIcon
        className={`${userDetailsDanger} ${userDetailsSmIcon}`}
        icon={faTimesCircle}
        onClick={() => confirmJoinAction({ operation: PROGRAM_JOIN_OPERATION.REJECT, programId })}
      />
    </>
  );
};

export default ProgramJoinValidationControls;
