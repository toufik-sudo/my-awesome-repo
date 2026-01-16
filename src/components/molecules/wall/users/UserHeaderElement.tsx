import React from 'react';

import SortSwitch from 'components/atoms/ui/SortSwitch';
import { PROGRAM_USERS_SORTING } from 'constants/api/userPrograms';
import { HTML_TAGS } from 'constants/general';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';

import style from 'sass-boilerplate/stylesheets/components/wall/UserHeaderElement.module.scss';
import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';

/**
 * Molecule component used to render Users Row Element
 *
 * @constructor
 */
const UserHeaderElement = ({ sortState, onSort, onProgramOnly = false }) => {
  const { userHeaderName, userHeaderDate, userHeaderSort, userHeaderSortActive } = style;
  const usersLabel = 'wall.users.';

  return (
    <thead>
      <tr>
        <td>
          <div className={coreStyle.pl5}>
            <SortSwitch
              wrapperClass={coreStyle.displayFlex}
              parentClass={`${userHeaderSort} ${coreStyle.pl2}`}
              activeClass={userHeaderSortActive}
              onSort={onSort}
              sortBy={PROGRAM_USERS_SORTING.FIRST_NAME}
              currentSorting={sortState}
            >
              <DynamicFormattedMessage tag={HTML_TAGS.P} id={`${usersLabel}firstName`} />
            </SortSwitch>
          </div>
        </td>
        <td>
          <SortSwitch
            wrapperClass={coreStyle.displayFlex}
            parentClass={userHeaderSort}
            activeClass={userHeaderSortActive}
            onSort={onSort}
            sortBy={PROGRAM_USERS_SORTING.NAME}
            currentSorting={sortState}
          >
            <DynamicFormattedMessage tag={HTML_TAGS.DIV} className={userHeaderName} id={`${usersLabel}name`} />
          </SortSwitch>
        </td>
        <td>
          <DynamicFormattedMessage tag={HTML_TAGS.SPAN} className={userHeaderDate} id={`${usersLabel}points`} />
        </td>
        <td>
          <SortSwitch
            wrapperClass={coreStyle.displayFlex}
            parentClass={userHeaderSort}
            activeClass={userHeaderSortActive}
            onSort={onSort}
            sortBy={PROGRAM_USERS_SORTING.RANK}
            currentSorting={sortState}
            disabled={!onProgramOnly}
          >
            <DynamicFormattedMessage tag={HTML_TAGS.SPAN} className={userHeaderDate} id={`${usersLabel}rank`} />
          </SortSwitch>
        </td>
        <td>
          <SortSwitch
            wrapperClass={coreStyle.displayFlex}
            parentClass={userHeaderSort}
            activeClass={userHeaderSortActive}
            onSort={onSort}
            sortBy={PROGRAM_USERS_SORTING.EMAIL}
            currentSorting={sortState}
          >
            <DynamicFormattedMessage tag={HTML_TAGS.DIV} className={userHeaderDate} id={`${usersLabel}email`} />
          </SortSwitch>
        </td>
        <td>
          <SortSwitch
            wrapperClass={coreStyle.displayFlex}
            parentClass={userHeaderSort}
            activeClass={userHeaderSortActive}
            onSort={onSort}
            sortBy={PROGRAM_USERS_SORTING.DATE}
            currentSorting={sortState}
          >
            <DynamicFormattedMessage tag={HTML_TAGS.DIV} className={userHeaderDate} id={`${usersLabel}date`} />
          </SortSwitch>
        </td>
        <td>
          <div className={`${coreStyle.displayFlex}`}>
            <DynamicFormattedMessage tag={HTML_TAGS.P} id={`${usersLabel}role`} />
          </div>
        </td>
        <td>
          <SortSwitch
            wrapperClass={coreStyle.displayFlex}
            parentClass={userHeaderSort}
            activeClass={userHeaderSortActive}
            onSort={onSort}
            sortBy={PROGRAM_USERS_SORTING.STATUS}
            currentSorting={sortState}
            disabled={!onProgramOnly}
          >
            <DynamicFormattedMessage tag={HTML_TAGS.P} id={`${usersLabel}status`} />
          </SortSwitch>
        </td>
      </tr>
    </thead>
  );
};

export default UserHeaderElement;
