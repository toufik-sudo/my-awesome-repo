import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFile } from '@fortawesome/free-regular-svg-icons';
import { faUserCheck, faLock, faLockOpen } from '@fortawesome/free-solid-svg-icons';

import { USER_DECLARATIONS_ROUTE } from 'constants/routes';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { HTML_TAGS } from 'constants/general';
import {
  getUserDeclarationStatusSettings,
  getDMYDateFormat,
  isIndividualDeclaration
} from 'services/UserDeclarationServices';

import style from 'sass-boilerplate/stylesheets/components/wall/UsersDeclaration.module.scss';
import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';

/**
 * Molecule component used to render table row for a user declaration
 * @param declaration
 * @param listState
 * @constructor
 */
const UserDeclarationRow = ({
  declaration: {
    id,
    source,
    program,
    dateOfEvent,
    companyName,
    firstName,
    lastName,
    user,
    product,
    otherProductName,
    status,
    quantity,
    amount,
    validatedBy
  },
  listState,
  isAdmin
}) => {
  const { statusStyle, statusDescriptionId } = getUserDeclarationStatusSettings(status, style);
  const { ml1, cursorDefault } = coreStyle;

  return (
    <>
      <Link
        to={
          isAdmin
            ? {
                pathname: `${USER_DECLARATIONS_ROUTE}/${id}`,
                state: listState
              }
            : '#'
        }
        className={`${style.userDeclarationRow} ${statusStyle} ${!isAdmin ? cursorDefault : ''}`}
      >
        <p className={style.userDeclarationRowElement}>
          <FontAwesomeIcon icon={isIndividualDeclaration(source) ? faUserCheck : faFile} />
        </p>
        <p className={style.userDeclarationRowElement}>{id}</p>
        <p className={style.userDeclarationRowElement}>{program.name}</p>
        <div className={style.userDeclarationRowElement}>
          <DynamicFormattedMessage id={`program.type.${program.type}`} tag={HTML_TAGS.P} />
          <FontAwesomeIcon className={ml1} icon={program.open ? faLockOpen : faLock} />
        </div>
        <p className={style.userDeclarationRowElement}>{getDMYDateFormat(dateOfEvent)}</p>
        <p className={style.userDeclarationRowElement}>
          {user.firstName} {user.lastName}
        </p>
        <p className={style.userDeclarationRowElement}>{companyName}</p>
        <p className={style.userDeclarationRowElement}>
          {firstName} {lastName}
        </p>
        <p className={style.userDeclarationRowElement}>{(product && product.name) || otherProductName}</p>
        <p className={style.userDeclarationRowElement}>{quantity}</p>
        <p className={style.userDeclarationRowElement}>{amount || 0}€</p>
        <DynamicFormattedMessage
          id={statusDescriptionId}
          tag={HTML_TAGS.P}
          className={style.userDeclarationRowElement}
        />
        <p className={style.userDeclarationRowElement}>
          {validatedBy && `${validatedBy.firstName} ${validatedBy.lastName}`}
        </p>
      </Link>
    </>
  );
};

export default UserDeclarationRow;
