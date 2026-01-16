import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';

import Loading from 'components/atoms/ui/Loading';
import { LOADER_TYPE } from 'constants/general';
import { PROGRAM_JOIN_OPERATION } from 'constants/api/userPrograms';

import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';

/**
 * Atom component used to render user pending join validation icons
 */
const UserPendingJoin = ({ userId, isValidatingJoin, confirmJoinAction }) => {
  const { width10, textCenter, mr2, withDangerColor, withPrimaryColor, textXl, pointer } = coreStyle;

  if (isValidatingJoin(userId)) {
    return <Loading type={LOADER_TYPE.DROPZONE} />;
  }

  return (
    <div className={`${width10} ${textCenter}`}>
      <FontAwesomeIcon
        onClick={() => confirmJoinAction({ operation: PROGRAM_JOIN_OPERATION.ACCEPT, userId })}
        className={`${withPrimaryColor} ${textXl} ${mr2} ${pointer}`}
        icon={faCheckCircle}
      />
      <FontAwesomeIcon
        onClick={() => confirmJoinAction({ operation: PROGRAM_JOIN_OPERATION.REJECT, userId })}
        className={`${withDangerColor} ${textXl} ${pointer}`}
        icon={faTimesCircle}
      />
    </div>
  );
};

export default UserPendingJoin;
