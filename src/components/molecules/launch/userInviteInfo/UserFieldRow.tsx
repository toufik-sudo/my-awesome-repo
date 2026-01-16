import React from 'react';

import UserFieldElement from 'components/molecules/launch/userInviteInfo/UserFieldElement';
import style from 'assets/style/components/launch/FieldBlock.module.scss';

/**
 * Molecule component used to render Mandatory field Row for user invitation
 *
 * @constructor
 */
const UserFieldRow = ({ selectedFields, setSelectedFields, formData, isUserInformation = false }) => (
  <div className={style.fieldBlockWrapper}>
    {formData &&
      formData.map((field, index) => (
        <UserFieldElement {...{ field, index, selectedFields, setSelectedFields, isUserInformation }} key={index} />
      ))}
  </div>
);

export default UserFieldRow;
