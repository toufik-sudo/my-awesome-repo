import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';

import { HTML_TAGS } from 'constants/general';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';

import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';
import componentStyle from 'sass-boilerplate/stylesheets/components/wall/AddBracketCTA.module.scss';

/**
 * Atom component used to render add bracket button
 *
 * @constructor
 * @see AddBracketStory
 */
const AddBracket = ({ onClick, type }) => {
  const { addBracket, addBracketIcon, addBracketText } = componentStyle;

  return (
    <div className={`${coreStyle.withPrimaryColor} ${addBracket}`} onClick={onClick}>
      <FontAwesomeIcon icon={faPlusCircle} className={addBracketIcon} />
      <DynamicFormattedMessage className={addBracketText} tag={HTML_TAGS.SPAN} id={`launchProgram.cube.${type}`} />
    </div>
  );
};

export default AddBracket;
