import React from 'react';

import UserDeclarationHeaderElement from './UserDeclarationHeaderElement';
import { USER_DECLARATION_HEADERS } from 'constants/wall/users';
import { useWindowSize } from 'hooks/others/useWindowSize';
import { WINDOW_SIZES } from 'constants/general';

import declarationStyle from 'sass-boilerplate/stylesheets/components/wall/UsersDeclaration.module.scss';

/**
 * Molecule component used to render User Declarations Header
 * @param props
 * @param props.sortState current sorting state
 * @param props.onSort callback to execute on sorting change
 * @constructor
 */
const UserDeclarationHeader = ({ sortState, onSort, isLoading = false, headers = USER_DECLARATION_HEADERS }) => {
  const { windowSize } = useWindowSize();
  const isSmallWindow = windowSize.width < WINDOW_SIZES.DESKTOP_SMALL;

  

  return (
    <div className={declarationStyle.userDeclarationHeader}>
      {headers.map(header => {
        const skipSorting = isSmallWindow || (header as any).isNotSortable;
        return (
          <UserDeclarationHeaderElement
            key={header.id}
            {...header}
            {...{ skipSorting, sortState, onSort, isLoading }}
          />
        );
      })}
    </div>
  );
};

export default UserDeclarationHeader;
