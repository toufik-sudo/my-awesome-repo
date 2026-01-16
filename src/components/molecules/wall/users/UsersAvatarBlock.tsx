import React from 'react';

import StringUtilities from 'utils/StringUtilities';

import style from 'sass-boilerplate/stylesheets/components/wall/UsersHeader.module.scss';

/**
 * Molecule component used to render Users Details Avatar
 *
 * @constructor
 */
const UsersAvatarBlock = ({ title = '', firstName = '', lastName = '', croppedPicturePath = undefined }) => {
  const { usersAvatarWrapper, usersAvatar, usersInfo, usersInfoElement } = style;

  return (
    <div className={usersAvatarWrapper}>
      <div className={usersAvatar}>
        <img src={croppedPicturePath} alt="user icon" />
      </div>
      <div className={usersInfo}>
        <div className={usersInfoElement}>{new StringUtilities().capitalize(title)}</div>
        <div className={usersInfoElement}>{firstName}</div>
        <div className={usersInfoElement}>{lastName}</div>
      </div>
    </div>
  );
};

export default UsersAvatarBlock;
