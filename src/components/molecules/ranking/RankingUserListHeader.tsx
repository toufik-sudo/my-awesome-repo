import React from 'react';

import { HTML_TAGS } from 'constants/general';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';

import style from 'sass-boilerplate/stylesheets/components/wall/UserHeaderElement.module.scss';
import tableStyle from 'sass-boilerplate/stylesheets/components/tables/Table.module.scss';

/**
 * Molecule component used to render ranking Users List Header
 *
 * @constructor
 */
const RankingUserListHeader = () => {
  const { userHeaderElement, userHeaderElementBlock, userHeaderName, userHeaderDate } = style;
  const { tableMdSize2 } = tableStyle;
  const usersLabel = 'wall.users.';

  return (
    <div className={userHeaderElement}>
      <div className={`${tableMdSize2} ${userHeaderElementBlock}`}>
        <DynamicFormattedMessage tag={HTML_TAGS.P} id={`${usersLabel}rank`} />
      </div>
      <div className={`${tableMdSize2} ${userHeaderElementBlock}`}>
        <DynamicFormattedMessage tag={HTML_TAGS.P} id={`${usersLabel}firstName`} />
      </div>
      <div className={`${tableMdSize2} ${userHeaderElementBlock}`}>
        <DynamicFormattedMessage tag={HTML_TAGS.DIV} className={userHeaderName} id={`${usersLabel}name`} />
      </div>
      <div className={`${tableMdSize2} ${userHeaderElementBlock}`}>
        <DynamicFormattedMessage tag={HTML_TAGS.DIV} className={userHeaderDate} id={`${usersLabel}points`} />
      </div>
    </div>
  );
};

export default RankingUserListHeader;
