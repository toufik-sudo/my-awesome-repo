import React from 'react';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { HTML_TAGS } from 'constants/general';
import GeneralBlock from 'components/molecules/block/GeneralBlock';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons/faInfoCircle';
import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';

/**
 * Molecule component used to render file upload invitation section
 * @constructor
 */
const InviteAllUsers = () => {
  return (
    <GeneralBlock>
      <p className={coreStyle.textCenter}>
        <FontAwesomeIcon icon={faInfoCircle} />
      </p>
      <DynamicFormattedMessage tag={HTML_TAGS.SPAN} id="wall.invitations.allUsers.selected.message" />
    </GeneralBlock>
  );
};

export default InviteAllUsers;
