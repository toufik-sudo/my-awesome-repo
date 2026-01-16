import React from 'react';

import { INPUT_TYPE } from 'constants/forms';

/**
 * Component used for rendering each specific user
 * @param item
 * @param container
 * @param labelTitle
 * @param selectedUsers
 * @param onSelectUser
 * @param onRemoveUser
 * @param checkmark
 * @constructor
 */
const SpecificUser = ({ item, container, labelTitle, selectedUsers, onSelectUser, onRemoveUser, checkmark }) => {
  const isChecked = selectedUsers.includes(item.id);
  return (
    <label key={item.id} className={container}>
      <span className={labelTitle}>{item.firstName + ' ' + item.lastName}</span>
      <input
        type={INPUT_TYPE.CHECKBOX}
        name={item.id}
        checked={isChecked}
        onChange={({ target }) => (isChecked ? onRemoveUser(Number(target.name)) : onSelectUser(Number(target.name)))}
      />
      <span className={checkmark} />
    </label>
  );
};

export default SpecificUser;
