import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { HTML_TAGS } from 'constants/general';
import { isObject } from 'utils/general';
import { canManageAdminOrCommunityManager } from 'services/wall/settings';

import style from 'sass-boilerplate/stylesheets/components/wall/WallSettingsTable.module.scss';
import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';

/**
 * Molecule component used to render table row
 * @param administrator
 * @param openEditRole
 * @param openConfirmRemoveRole
 * @param platformHierarchicType
 * @param currentUser
 * @constructor
 */
const WallSettingsAdministratorsRow = ({
  administrator,
  openEditRole,
  openConfirmRemoveRole,
  platformHierarchicType,
  currentUser
}) => {
  const { tableRow, tableRowElement, tableRowContentWrapper, flexSpace2 } = style;
  const { withSecondaryColor, mx1, pointer, pr1, wordBreakNormal } = coreStyle;
  const { role, status, email, lastName, firstName, uuid } = administrator;
  const displayEditButton = canManageAdminOrCommunityManager(administrator, currentUser, platformHierarchicType);
  const displayDeleteButton = canManageAdminOrCommunityManager(
    administrator,
    currentUser,
    platformHierarchicType,
    true
  );

  return (
    <div className={tableRow}>
      <div className={tableRowContentWrapper}>
        <p className={tableRowElement}>{lastName}</p>
        <p className={tableRowElement}>{firstName}</p>
        <p className={`${tableRowElement} ${flexSpace2} ${pr1}`}>{email}</p>
        {!isObject(status) && (
          <DynamicFormattedMessage className={tableRowElement} tag={HTML_TAGS.P} id={`wall.admin.status.${status}`} />
        )}
        {role && (
          <DynamicFormattedMessage
            className={`${tableRowElement} ${wordBreakNormal}`}
            tag={HTML_TAGS.P}
            id={`wall.users.role.${role}`}
            values={{ platformHierarchicType }}
          />
        )}
        <p className={tableRowElement}>
          <>
            {displayEditButton && (
              <FontAwesomeIcon
                className={`${withSecondaryColor} ${mx1} ${pointer}`}
                icon={faEdit}
                onClick={() => openEditRole({ uuid, role })}
              />
            )}
            {displayDeleteButton && (
              <FontAwesomeIcon
                className={`${withSecondaryColor} ${pointer}`}
                icon={faTrash}
                onClick={() => openConfirmRemoveRole(uuid)}
              />
            )}
          </>
        </p>
      </div>
    </div>
  );
};

export default WallSettingsAdministratorsRow;
