import React, { useMemo } from 'react';
import moment from 'moment';

import UserDetailsRow from 'components/molecules/wall/user-details/UserDetailsRow';
import { prepareUserDetailsToDisplay } from 'services/UsersServices';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { HTML_TAGS } from 'constants/general';
import { DEFAULT_ISO_DATE_FORMAT, INPUT_TYPE } from 'constants/forms';

import style from 'sass-boilerplate/stylesheets/components/wall/WallUserDetails.module.scss';
import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';

/**
 * Organism component used to render user details informations
 * @constructor
 */
const UserDetailsInformation = ({ userDetails }) => {
  const { userDetailsInformations } = style;
  const { withPrimaryColor, withBoldFont, withFontLarge, mt1 } = coreStyle;

  const fieldsToDisplay = useMemo(() => prepareUserDetailsToDisplay(userDetails), [userDetails]);

  return (
    <div className={userDetailsInformations}>
      <DynamicFormattedMessage
        className={`${withFontLarge} ${withPrimaryColor} ${withBoldFont}`}
        id={'wall.user.details.information.title'}
        tag={HTML_TAGS.P}
      />
      <div className={mt1}>
        {fieldsToDisplay.map(({ type = INPUT_TYPE.TEXT, label, value }) => (
          <UserDetailsRow
            key={`${userDetails.uuid}_${label}`}
            type={type}
            label={`wall.user.details.label.${label}`}
            defaultValue={type === INPUT_TYPE.DATETIME && value ? moment(value).format(DEFAULT_ISO_DATE_FORMAT) : value}
          />
        ))}
      </div>
    </div>
  );
};

export default UserDetailsInformation;
