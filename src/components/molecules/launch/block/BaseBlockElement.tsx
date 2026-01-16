import React from 'react';

import style from 'assets/style/components/BlockElement.module.scss';

/**
 * Molecule component used render base card component
 * @param titleSection
 * @param bodySection
 * @param icon
 * @param className
 * @param buttonAction
 * @constructor
 */
const BaseBlockElement = ({ titleSection, bodySection, icon, buttonAction, className = '' }) => {
  const { block, blockProgram, blockWithShadow } = style;

  return (
    <div className={`${block} ${blockProgram} ${blockWithShadow} ${className}`}>
      {icon && icon}
      {titleSection}
      {bodySection}
      {buttonAction}
    </div>
  );
};

export default BaseBlockElement;
