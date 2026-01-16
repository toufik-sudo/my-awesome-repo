import React from 'react';

import ErrorList from 'components/molecules/launch/userInviteList/ErrorList';
import SpringAnimation from 'components/molecules/animations/SpringAnimation';
import ErrorListTitle from 'components/atoms/launch/ErrorListTitle';
import { setTranslate } from 'utils/animations';
import { DELAY_INITIAL } from 'constants/animations';
import { hasInvalidEmail } from 'services/LaunchServices';
import style from 'assets/style/components/launch/UserListErrorDisplay.module.scss';

/**
 * Organism component used to display user invite errors
 *
 * @param uploadResponse
 * @constructor
 */
export const UserInviteErrorDisplay = ({ uploadResponse }) => {
  if (hasInvalidEmail(uploadResponse)) return null;

  const invalidRecords = uploadResponse.data.invalidRecords;

  return (
    <SpringAnimation settings={setTranslate(DELAY_INITIAL)}>
      <div className={style.errorsDisplayContainer}>
        <ErrorListTitle invalidRecordsLength={invalidRecords.length} />
        <ErrorList {...{ invalidRecords }} />
      </div>
    </SpringAnimation>
  );
};
