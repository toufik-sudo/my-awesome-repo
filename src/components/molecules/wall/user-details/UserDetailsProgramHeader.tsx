import React from 'react';

import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { HTML_TAGS } from 'constants/general';

import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';
import style from 'sass-boilerplate/stylesheets/components/wall/WallUserDetails.module.scss';

/**
 * Molecule component used to render user details header
 * @constructor
 */
const UserDetailsProgramHeader = () => {
  const keyPrefix = 'wall.user.details.programs.label.';
  return (
    <div className={style.userDetailsProgramsHeader}>
      <DynamicFormattedMessage className={coreStyle.felxSpace1} id={`${keyPrefix}name`} tag={HTML_TAGS.P} />
      <DynamicFormattedMessage className={coreStyle.felxSpace1} id={`${keyPrefix}date`} tag={HTML_TAGS.P} />
      <DynamicFormattedMessage className={coreStyle.felxSpace1} id={`${keyPrefix}subscribed`} tag={HTML_TAGS.P} />
      <DynamicFormattedMessage className={coreStyle.flexSpace1} id={`${keyPrefix}role`} tag={HTML_TAGS.P} />
      <DynamicFormattedMessage className={coreStyle.felxSpace1} id={`${keyPrefix}status`} tag={HTML_TAGS.P} />
      <p />
    </div>
  );
};

export default UserDetailsProgramHeader;
