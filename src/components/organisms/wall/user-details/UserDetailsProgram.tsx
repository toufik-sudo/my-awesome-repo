import React, { useState } from 'react';

import UserDetailsProgramHeader from 'components/molecules/wall/user-details/UserDetailsProgramHeader';
import UserDetailsProgramRow from 'components/organisms/wall/user-details/UserDetailsProgramRow';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { HTML_TAGS } from 'constants/general';

import style from 'sass-boilerplate/stylesheets/components/wall/WallUserDetails.module.scss';
import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';

/**
 * Organism component used to render user details program
 * @param type
 * @param title
 * @param list
 * @constructor
 */
const UserDetailsProgram = ({ type, list = [], ...actions }) => {
  const { userDetailsProgram, userDetailsProgramTitle, userDetailsProgramsList, userDetailsDanger } = style;
  const { withGrayAccentColor, withLightFont } = coreStyle;
  const [userBlockingError, setUserBlockingError] = useState(false);

  return (
    <>
      {userBlockingError && (
        <DynamicFormattedMessage
          className={userDetailsDanger}
          tag={HTML_TAGS.P}
          id={'wall.user.details.programs.blockingError'}
        />
      )}
      <div className={userDetailsProgram}>
        <DynamicFormattedMessage
          className={`${withGrayAccentColor} ${userDetailsProgramTitle} ${withLightFont}`}
          tag={HTML_TAGS.P}
          id={`wall.user.details.programs.title.${type}`}
        />
        <UserDetailsProgramHeader />
        <div className={userDetailsProgramsList}>
          {list.map((row, index) => (
            <UserDetailsProgramRow key={`${row.name}_${index}`} {...{ row, type, setUserBlockingError, ...actions }} />
          ))}
        </div>
      </div>
    </>
  );
};

export default UserDetailsProgram;
