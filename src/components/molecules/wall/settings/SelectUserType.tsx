import React from 'react';

import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { PLATFORM_INVITE_ROLE } from 'constants/api/platforms';
import { HTML_TAGS } from 'constants/general';
import { ALL_ADMIN_ROLES, ALL_MANAGER_ROLES } from 'constants/security/access';

import style from 'sass-boilerplate/stylesheets/components/wall/SelectTypeRadio.module.scss';

/**
 * Molecule component used to render selected type
 * @param selectedType
 * @constructor
 */
const SelectUserType = ({ platformHierarchicType, selectedRole, setSelectedRole }) => {
  const { selectTypeContainer, selectTypeElement, selectTypeElementActive, selectTypeElementRadio } = style;

  return (
    <div className={selectTypeContainer}>
      <div
        className={`${selectTypeElement} ${ALL_ADMIN_ROLES.includes(selectedRole) ? selectTypeElementActive : ''} `}
        onClick={() => setSelectedRole(PLATFORM_INVITE_ROLE.ADMIN)}
      >
        <DynamicFormattedMessage
          tag={HTML_TAGS.P}
          id={'wall.settings.administrators.admin'}
          values={{ platformHierarchicType }}
        />
        <div className={selectTypeElementRadio} />
      </div>
      <div
        className={`${selectTypeElement} ${ALL_MANAGER_ROLES.includes(selectedRole) ? selectTypeElementActive : ''} `}
        onClick={() => setSelectedRole(PLATFORM_INVITE_ROLE.MANAGER)}
      >
        <DynamicFormattedMessage
          tag={HTML_TAGS.P}
          id={'wall.settings.administrators.community.manager'}
          values={{ platformHierarchicType }}
        />
        <div className={selectTypeElementRadio} />
      </div>
    </div>
  );
};

export default SelectUserType;
