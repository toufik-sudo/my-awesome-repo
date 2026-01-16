import React from 'react';
import { DynamicFormattedMessage } from '../../atoms/ui/DynamicFormattedMessage';
import { HTML_TAGS } from '../../../constants/general';
import GeneralBlock from '../block/GeneralBlock';
import coreStyle from '../../../sass-boilerplate/stylesheets/style.module.scss';

/**
 * Molecule component used to render freemium notice
 *
 * @constructor
 */
const FreemiumNotice = () => {
  const { py3, mx2, contentCentered, flexJustifyContentCenter, textTiny, withGrayAccentColor } = coreStyle;

  return (
    <GeneralBlock className={`${contentCentered} ${py3} ${mx2} ${flexJustifyContentCenter}`}>
      <DynamicFormattedMessage
        className={`${withGrayAccentColor} ${textTiny}`}
        tag={HTML_TAGS.SPAN}
        id="wall.freemium.notice"
      />
    </GeneralBlock>
  );
};

export default FreemiumNotice;
