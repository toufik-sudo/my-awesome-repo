import React from 'react';

import { emptyFn } from 'utils/general';

import style from 'sass-boilerplate/stylesheets/components/block/Block.module.scss';

/**
 * Molecule component used to render customizable general block.
 * @param children
 * @param isShadow
 * @param isBorderRadius
 * @param className
 * @param handleClick
 * @param tooltipId
 * @constructor
 */
const GeneralBlock = ({
  children,
  isShadow = true,
  isBorderRadius = true,
  className = '',
  handleClick = emptyFn(),
  tooltipId = ''
}) => {
  const { generalBlock, shadow, borderRadius } = style;
  const radiusClass = isBorderRadius ? borderRadius : '';
  const shadowClass = isShadow ? shadow : '';

  return (
    <div
      onClick={handleClick}
      className={`${generalBlock} ${radiusClass} ${shadowClass} ${className}`}
      data-for={tooltipId}
      data-tip
    >
      {children}
    </div>
  );
};

export default GeneralBlock;
