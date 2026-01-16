import React from 'react';

import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';

import grid from 'sass-boilerplate/stylesheets/vendors/bootstrap-grid.module.scss';
import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';

/**
 * Atom component used to render a box with title + subtitle
 *
 * @param titleId
 * @param textId
 * @param additionalClass
 * @constructor
 *
 * @see BlockElementStory
 */
const BlockElement = ({ titleId, textId, additionalTitleClass, additionalContentClass }) => {
  const { lead, mb9, withDefaultColor, withBoldFont } = coreStyle;

  return (
    <div className={`${grid['col-md-6']} ${grid['col-lg-4']} ${mb9}`}>
      <DynamicFormattedMessage tag="div" className={` ${lead} ${withBoldFont} ${additionalTitleClass}`} id={titleId} />
      <DynamicFormattedMessage tag="div" className={`${withDefaultColor} ${additionalContentClass}`} id={textId} />
    </div>
  );
};

export default BlockElement;
