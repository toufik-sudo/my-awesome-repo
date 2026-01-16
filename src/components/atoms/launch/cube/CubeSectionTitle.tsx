import React from 'react';

import { HTML_TAGS } from 'constants/general';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';

import style from 'sass-boilerplate/stylesheets/components/launch/Cube.module.scss';

/**
 * Atom component used to render cube section title
 *
 * @param type
 * @constructor
 */
const CubeSectionTitle = ({ type }) => (
  <DynamicFormattedMessage
    className={style.cubeSectionTitle}
    tag={HTML_TAGS.P}
    id={`launchProgram.cube.${type}.title`}
  />
);

export default CubeSectionTitle;
