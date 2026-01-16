/* eslint-disable quotes */
import React, { useEffect } from 'react';
import Slider from 'rc-slider';

import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { AVATAR_EDITOR_CONFIG } from 'constants/personalInformation';
import { HTML_TAGS } from 'constants/general';

import style from 'assets/style/components/PersonalInformation/AvatarCreator.module.scss';

/**
 * Molecule component used to render a single slider control with label
 *
 * @param value
 * @param setValue
 * @param type
 * @param config
 * @param avatarConfig
 * @constructor
 *
 * @see SliderControlStory
 */
const SliderControl = ({ value, type, config, setValue }) => {
  const { sliderControl, sliderLabel } = style;
  useEffect(() => {
    setValue({ zoom: 1, rotate: 0 });
  }, [type]);
  return (
    <div className={sliderControl}>
      <DynamicFormattedMessage
        tag={HTML_TAGS.SPAN}
        className={sliderLabel}
        id={`personalInformation.info.slider.${type}`}
      />
      {type == 'zoom' && (
        <Slider
          min={-10}
          max={10}
          step={AVATAR_EDITOR_CONFIG.SLIDER_STEP}
          value={value['zoom']}
          defaultValue={10}
          startValue={10}
          onChange={(newValue: any) => {
            setValue({ ...value, ['zoom']: newValue });
            console.log({ newValue: newValue });
          }}
        />
      )}
      {type == 'rotate' && (
        <Slider
          min={config.min}
          max={config.max}
          step={AVATAR_EDITOR_CONFIG.SLIDER_STEP}
          value={value[type]}
          defaultValue={0}
          startValue={0}
          onChange={(newValue: any) => {
            setValue({ ...value, [type]: newValue });
            console.log({ newValue: newValue });
          }}
        />
      )}
    </div>
  );
};

export default SliderControl;
