import React from 'react';

import SortSwitch from 'components/atoms/ui/SortSwitch';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { HTML_TAGS } from 'constants/general';

import style from 'sass-boilerplate/stylesheets/components/wall/UserHeaderElement.module.scss';
import declarationStyle from 'sass-boilerplate/stylesheets/components/wall/UsersDeclaration.module.scss';
import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';

/**
 * Molecule component used to render header of point conversions table
 * @param id
 * @param className
 * @param sortBy
 * @param onSort
 * @param sortState
 * @constructor
 */
const PointConversionsHeaderElement = ({ id, skipSorting, sortBy, onSort, isLoading, sortState: currentSorting }) => {
  const pointConversionsLabel = `wall.pointConversions.${id}`;
  const { userHeaderSortActive } = style;
  const { userDeclarationHeaderElement } = declarationStyle;

  const headerLabel = <DynamicFormattedMessage tag={HTML_TAGS.P} id={pointConversionsLabel} />;

  if (skipSorting) {
    return <div className={`${coreStyle.flexSpace1} ${userDeclarationHeaderElement}`}>{headerLabel}</div>;
  }

  return (
    <SortSwitch
      {...{
        activeClass: userHeaderSortActive,
        sortBy,
        disabled: isLoading,
        onSort,
        currentSorting,
        sortIconsFirst: true
      }}
    >
      {headerLabel}
    </SortSwitch>
  );
};

export default PointConversionsHeaderElement;
