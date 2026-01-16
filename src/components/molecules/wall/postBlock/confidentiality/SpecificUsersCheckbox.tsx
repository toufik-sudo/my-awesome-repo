import React from 'react';

import SpecificUser from 'components/atoms/wall/PostConfidentiality/SpecificUser';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { HTML_TAGS } from 'constants/general';

import style from 'sass-boilerplate/stylesheets/components/wall/PostConfidentiality.module.scss';

/**
 * Molecule component used to render a checkbox list
 * @param onSelectUsers
 * @param specificUsers
 * @param selectedUsers
 * @constructor
 */
const SpecificUsersCheckbox = ({ onSelectUser, onRemoveUser, specificUsers, selectedUsers }) => {
  const { specificUsersList, container, checkmark, labelTitle } = style;
  if (!specificUsers.length) {
    return <DynamicFormattedMessage tag={HTML_TAGS.P} id={'wall.posts.confidentiality.noUsers'} />;
  }

  return (
    <>
      <div className={specificUsersList}>
        {specificUsers.length &&
          specificUsers.map(item => {
            return (
              <SpecificUser
                key={item.id}
                {...{ item, container, labelTitle, selectedUsers, onSelectUser, onRemoveUser, checkmark }}
              />
            );
          })}
      </div>
    </>
  );
};

export default SpecificUsersCheckbox;
