import React from 'react';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';

/**
 * Component used to render a single User Declaration note
 * @param props
 * @param props.id
 * @param props.text
 * @param props.onDelete
 * @constructor
 */
const UserDeclarationNote = ({ id, text, onDelete }) => {
  const {
    displayFlex,
    mt15,
    smallText,
    displayBlock,
    withDangerColor,
    relative,
    absolute,
    top0,
    right0,
    pointer,
    pr15,
    mr1,
    pr3
  } = coreStyle;

  return (
    <div className={`${displayFlex} ${mt15} ${smallText} ${relative} ${pr15}`}>
      <div className={displayBlock}>
        <FontAwesomeIcon
          icon={faTimesCircle}
          className={`${withDangerColor} ${absolute} ${top0} ${right0} ${pointer} ${mr1}`}
          onClick={() => onDelete(id)}
        />
        <p className={pr3}>{text}</p>
      </div>
    </div>
  );
};

export default UserDeclarationNote;
