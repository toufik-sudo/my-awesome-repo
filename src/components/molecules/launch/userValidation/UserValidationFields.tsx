import React from 'react';

import UserValidationFieldBlock from 'components/molecules/launch/userValidation/UserValidationFieldBlock';
import style from 'assets/style/components/wall/GeneralWallStructure.module.scss';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';

/**
 * Molecule component used to render User Validation fields
 *
 * @constructor
 */
const UserValidationFields = () => (
  <div className={style.section}>
    <DynamicFormattedMessage tag="p" className={style.title} id="launchProgram.users.validationTitle" />
    <UserValidationFieldBlock />
  </div>
);

export default UserValidationFields;
