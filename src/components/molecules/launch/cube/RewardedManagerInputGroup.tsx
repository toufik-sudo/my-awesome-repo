import React from 'react';

import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { HTML_TAGS } from 'constants/general';
import { MIN_INPUT_NUMBER_VALUE } from 'constants/validation';
import { disableCubeFieldsInvalidChars } from 'services/FormServices';

import inputStyle from 'assets/style/common/Input.module.scss';
import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';
import style from 'sass-boilerplate/stylesheets/components/launch/Cube.module.scss';

/**
 * Molecule component used to render input group for reward managers
 *
 * @param selectedRewardManagers
 * @param setRewardManagers
 * @param fieldError
 * @constructor
 */
const RewardedManagerInputGroup = ({ selectedRewardManagers, setRewardManagers, fieldError }) => {
  const { cubeError, cubeRewardManagersInputGroup } = style;
  const { container, defaultInputStyle } = inputStyle;
  const { pt3, withFontMedium } = coreStyle;

  return (
    <div className={container}>
      <DynamicFormattedMessage
        tag={HTML_TAGS.P}
        className={`${withFontMedium} ${pt3}`}
        id="launchProgram.cube.rewardManagers.percentageLabel"
      />
      {fieldError && <DynamicFormattedMessage className={cubeError} id={fieldError} tag={HTML_TAGS.P} />}
      <span className={cubeRewardManagersInputGroup}>
        <span>
          <input
            className={defaultInputStyle}
            value={selectedRewardManagers}
            min={MIN_INPUT_NUMBER_VALUE}
            onKeyDown={e => disableCubeFieldsInvalidChars(e, 'cubeRewardManagers')}
            onChange={e => setRewardManagers(e.target.value)}
          />
        </span>
        <DynamicFormattedMessage tag={HTML_TAGS.SPAN} id="launchProgram.cube.rewardManagers.percentageText" />
      </span>
    </div>
  );
};

export default RewardedManagerInputGroup;
