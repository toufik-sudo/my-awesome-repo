import React from 'react';

import GeneralBlock from 'components/molecules/block/GeneralBlock';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { HTML_TAGS } from 'constants/general';

import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';

/**
 * Molecule component used to render a general error block
 *
 * @constructor
 */
export function GeneralErrorBlock({ id = '' }) {
  const { py10, withDangerColor, textCenter, withFontXLarge } = coreStyle;
  const noProgramJoined = 'wall.programs.joined.none';

  return (
    <GeneralBlock className={`${py10} ${withDangerColor} ${textCenter} ${withFontXLarge}`}>
      <DynamicFormattedMessage tag={HTML_TAGS.SPAN} id={id || noProgramJoined} />
    </GeneralBlock>
  );
}
