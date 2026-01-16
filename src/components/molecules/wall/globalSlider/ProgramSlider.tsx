import React, { useRef } from 'react';
import Slider from 'react-slick';
import ReactTooltip from 'react-tooltip';
import { useIntl } from 'react-intl';

import { TOOLTIP_FIELDS } from 'constants/tootltip';
import { wallWidgetSliderSettings } from 'constants/slider';
import { setSelectedProgram, setIsProgramSelectionLocked } from 'store/actions/wallActions';
import { useDispatch } from 'react-redux';
import { useWallSelection } from 'hooks/wall/useWallSelection';
import { DEFAULT_ALL_PROGRAMS } from 'constants/wall/programButtons';
import { PLATFORM_SELECTION_DELAY } from 'constants/general';
import { useSelectedProgramDesign } from 'hooks/wall/ui/useSelectedProgramColors';
import { useWallRoute } from 'hooks/wall/useWallRoute';
import { useUserRole } from 'hooks/user/useUserRole';
import { ROLE } from 'constants/security/access';

import style from 'sass-boilerplate/stylesheets/components/wall/ProgramsSlider.module.scss';

/**
 * Uses programs to render a switch and trigger the change of active program on action
 *
 * @param globalClass
 * @param programs
 * @constructor
 */
const ProgramSlider = ({ globalClass, programs }) => {
  const { programSliderWrapper, sliderProgram, programSliderContainer, programTooltip } = style;

  const tooltipRef = useRef();
  const dispatch = useDispatch();
  const { formatMessage } = useIntl();
  const { selectedProgramName, selectedProgramIndex, isProgramSelectionLocked } = useWallSelection();

  const programTooltipName =
    (selectedProgramName !== DEFAULT_ALL_PROGRAMS && selectedProgramName) ||
    formatMessage({ id: `wall.${DEFAULT_ALL_PROGRAMS}` });
  const selectedProgram = programs[selectedProgramIndex];
  const currentSliderOptions = !isProgramSelectionLocked ? programs : [selectedProgram];
  const { colorMainButtonsBackground, colorMainButtonText, colorProgramSliderBorder } = useSelectedProgramDesign();
  const { colorSidebar } = useSelectedProgramDesign();
  const { isDeclarationRoute } = useWallRoute();
  const userRole = useUserRole();

  return (
    <div
      className={`${programSliderContainer} ${globalClass}`}
      data-tip={programTooltipName}
      ref={tooltipRef}
      data-for="platformsTooltip"
      style={{
        color: colorMainButtonText,
        backgroundColor: colorMainButtonsBackground,
        borderColor: colorProgramSliderBorder
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
          initialSlide: selectedProgramIndex,
          style: { background: isDeclarationRoute && userRole === ROLE.ADMIN ? colorSidebar : '' },
          className: `${programSliderWrapper} ${globalClass}`,
          afterChange: index => {
            if (isProgramSelectionLocked) {
              return;
            }
            setSelectedProgram(index, programs, dispatch);
            setTimeout(() => dispatch(setIsProgramSelectionLocked(false)), PLATFORM_SELECTION_DELAY);
            ReactTooltip.hide(tooltipRef.current);
          }
        }}
      >
        {currentSliderOptions.map((entity, index) => (
          <div key={`program${index}`} className={sliderProgram}>
            {entity.name === DEFAULT_ALL_PROGRAMS ? formatMessage({ id: `wall.${DEFAULT_ALL_PROGRAMS}` }) : entity.name}
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default ProgramSlider;
