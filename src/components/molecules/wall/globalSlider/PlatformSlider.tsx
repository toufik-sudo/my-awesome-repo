import React, { useRef, useCallback } from 'react';
import Slider from 'react-slick';
import ReactTooltip from 'react-tooltip';

import { TOOLTIP_FIELDS } from 'constants/tootltip';
import { wallWidgetSliderSettings } from 'constants/slider';
import { setActivePlatform, setIsProgramSelectionLocked } from 'store/actions/wallActions';
import { useDispatch } from 'react-redux';
import { PLATFORM_SELECTION_DELAY, WHITE } from 'constants/general';
import { useSelectedProgramDesign } from 'hooks/wall/ui/useSelectedProgramColors';

import style from 'sass-boilerplate/stylesheets/components/wall/ProgramsSlider.module.scss';
import { PLATFORM_HIERARCHIC_TYPE } from 'constants/platforms';
import { useWallRoute } from 'hooks/wall/useWallRoute';

/**
 * Uses platforms to render a switch and trigger the change of active platform on action
 * @param globalClass
 * @param platforms
 * @param isProgramSelectionLocked
 * @param selectedPlatform
 * @param onChange
 * @constructor
 */
const PlatformSlider = ({
  globalClass,
  platforms,
  isProgramSelectionLocked = false,
  selectedPlatform,
  onChange = undefined
}) => {
  const {
    programSliderWrapper,
    sliderProgram,
    programSliderContainer,
    programTooltip,
    subPlatform,
    superPlatform
  } = style;
  const tooltipRef = useRef();
  const dispatch = useDispatch();
  const { index, name, hierarchicType } = selectedPlatform;
  const currentSliderOptions = !isProgramSelectionLocked ? platforms : [platforms[index]];
  const { colorMainButtons } = useSelectedProgramDesign();
  const { isWallRoute, isCommunicationRoute } = useWallRoute();

  let sliderClass = '';
  if (hierarchicType === PLATFORM_HIERARCHIC_TYPE.SUB_PLATFORM) {
    sliderClass = subPlatform;
  }

  if (hierarchicType === PLATFORM_HIERARCHIC_TYPE.SUPER_PLATFORM) {
    sliderClass = superPlatform;
  }

  const handleAfterChange = useCallback(
    index => {
      if (onChange) {
        onChange(index);
        return;
      }
      if (isProgramSelectionLocked) {
        return;
      }
      dispatch(setActivePlatform(index));
      setTimeout(() => dispatch(setIsProgramSelectionLocked(false)), PLATFORM_SELECTION_DELAY);
      ReactTooltip.hide(tooltipRef.current);
    },
    [onChange, isProgramSelectionLocked, dispatch, tooltipRef]
  );

  return (
    <div
      className={`${programSliderContainer} ${globalClass} ${sliderClass}`}
      data-tip={name}
      ref={tooltipRef}
      data-for="platformsTooltip"
      style={{
        color: colorMainButtons,
        borderColor: colorMainButtons,
        backgroundColor: !sliderClass && (isWallRoute || isCommunicationRoute) ? WHITE : ''
      }}
    >
      <ReactTooltip
        place={TOOLTIP_FIELDS.PLACE_TOP}
        effect={TOOLTIP_FIELDS.EFFECT_SOLID}
        id="platformsTooltip"
        className={programTooltip}
      />
      <Slider
        {...{
          ...wallWidgetSliderSettings,
          initialSlide: index,
          className: `${programSliderWrapper} ${globalClass} ${sliderClass}`,
          afterChange: handleAfterChange
        }}
      >
        {currentSliderOptions.map((platform, index) => (
          <div key={`platform${index}`} className={sliderProgram}>
            {platform.name}
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default PlatformSlider;
