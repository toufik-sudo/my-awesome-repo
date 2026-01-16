import React from 'react';

import MomentUtilities from 'utils/MomentUtilities';
import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import componentStyle from 'sass-boilerplate/stylesheets/components/communication/Communication.module.scss';

/**
 * Molecule component used to render list row element
 *
 * @param id
 * @param name
 * @param program
 * @param recipients
 * @param createdAt
 * @param openDeleteUserListModal
 * @param onEditUser
 * @param canEdit
 * @constructor
 */
const UserListRowElement = ({
  id,
  name,
  program,
  recipients,
  createdAt,
  openDeleteUserListModal,
  onEditUser,
  canEdit
}) => {
  const {
    campaignRowName,
    campaignRowElement,
    campaignRowElementContainer,
    campaignRowDefaultElement,
    listActionsGroup,
    listRowElementContainer,
    listRowDefaultElement
  } = componentStyle;

  return (
    <div className={campaignRowElement}>
      <div className={`${campaignRowElementContainer} ${listRowElementContainer}`}>
        <p className={`${campaignRowName} ${campaignRowDefaultElement} ${listRowDefaultElement}`}>{name}</p>
        <p className={`${campaignRowDefaultElement} ${listRowDefaultElement}`}>{program && program.name}</p>
        <p className={`${campaignRowDefaultElement} ${listRowDefaultElement}`}>{recipients}</p>
        <p className={`${campaignRowDefaultElement} ${listRowDefaultElement}`}>
          {MomentUtilities.formatDate(createdAt)}
        </p>
        <div className={listActionsGroup}>
          {canEdit && <FontAwesomeIcon icon={faPen} onClick={() => onEditUser(id)} />}
          <FontAwesomeIcon icon={faTrash} onClick={() => openDeleteUserListModal(id)} />
        </div>
      </div>
    </div>
  );
};

export default UserListRowElement;
