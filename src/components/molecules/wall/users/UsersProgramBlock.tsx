import React from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';

import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { DEFAULT_ALL_PROGRAMS } from 'constants/wall/programButtons';
import { HTML_TAGS } from 'constants/general';
import { IStore } from 'interfaces/store/IStore';

import style from 'sass-boilerplate/stylesheets/components/wall/UsersHeader.module.scss';
import tableStyle from 'sass-boilerplate/stylesheets/components/tables/Table.module.scss';

/**
 * Molecule component used to render Users Program block
 *
 * @constructor
 */
const UsersProgramBlock = () => {
  const { usersProgramBlock, usersProgramBlockLabel } = style;
  const selectedName = useSelector(state => (state as IStore).wallReducer.selectedProgramName);
  const { formatMessage } = useIntl();
  const programName =
    selectedName == DEFAULT_ALL_PROGRAMS || !selectedName
      ? formatMessage({ id: `wall.${DEFAULT_ALL_PROGRAMS}` })
      : selectedName;

  return (
    <div className={`${usersProgramBlock} ${tableStyle.tableHeaderElem}`}>
      <DynamicFormattedMessage tag={HTML_TAGS.P} id="wall.users.program" className={usersProgramBlockLabel} />
      {programName}
    </div>
  );
};

export default UsersProgramBlock;
