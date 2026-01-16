import React from 'react';

import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { HTML_TAGS } from 'constants/general';

import style from 'sass-boilerplate/stylesheets/components/launch/Cube.module.scss';

/**
 * Molecule component used to render cube rewards titles
 *
 * @constructor
 */
const CubeRewardsTitles = ({ type }) => {
  const { cubeSubtitle, cubeSectionTitle } = style;

  return (
    <>
      <DynamicFormattedMessage className={cubeSubtitle} tag={HTML_TAGS.H4} id="launchProgram.cube.subtitle" />
      <DynamicFormattedMessage className={cubeSectionTitle} tag={HTML_TAGS.P} id={`launchProgram.cube.${type}.title`} />
    </>
  );
};

export default CubeRewardsTitles;
