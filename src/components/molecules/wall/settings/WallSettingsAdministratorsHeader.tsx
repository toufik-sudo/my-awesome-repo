import React from 'react';

import { HTML_TAGS } from 'constants/general';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';

import style from 'sass-boilerplate/stylesheets/components/wall/WallSettingsTable.module.scss';
import tableStyle from 'sass-boilerplate/stylesheets/components/tables/Table.module.scss';

/**
 * Molecule component used to render administrators table header
 * @constructor
 */
const WallSettingsAdministratorsHeader = () => {
  const { tableHeader, tableHeaderElement, flexSpace2 } = style;

  return (
    <div className={`${tableHeader} ${tableStyle.tableLg}`}>
      <DynamicFormattedMessage className={tableHeaderElement} tag={HTML_TAGS.P} id="form.label.lastName" />
      <DynamicFormattedMessage className={tableHeaderElement} tag={HTML_TAGS.P} id="form.label.firstName" />
      <DynamicFormattedMessage
        className={`${tableHeaderElement} ${flexSpace2}`}
        tag={HTML_TAGS.P}
        id="form.label.email"
      />
      <DynamicFormattedMessage className={tableHeaderElement} tag={HTML_TAGS.P} id="wall.users.status" />
      <DynamicFormattedMessage className={tableHeaderElement} tag={HTML_TAGS.P} id="wall.users.role" />
      <p className={tableHeaderElement} />
    </div>
  );
};

export default WallSettingsAdministratorsHeader;
