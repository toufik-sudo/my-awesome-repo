import React from 'react';

import PlatformDropdown from './PlatformDropdown';
import ProgramDropdown from './ProgramDropdown';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { HTML_TAGS } from 'constants/general';
import { useWallSelection } from 'hooks/wall/useWallSelection';
import { useProgramRouteModifier } from 'hooks/general/useProgramRouteModifier';

import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';

/**
 * Molecule component used to render platform & program dropdown selectors
 * @constructor
 */
const GlobalSlider = ({
  className = '',
  programLabelClass = '',
  isOnUserDeclarations = false,
  onlyPlatformsSlider = false,
  platformSliderClass = ''
}) => {
  const { textCenter, withFontSmall, relative, positionRelative, switchWrapper } = coreStyle;
  const { programs, platforms, isProgramSelectionLocked, selectedPlatform } = useWallSelection();

  useProgramRouteModifier();

  if (!platforms.length) return null;

  return (
    <div className={`${positionRelative} ${switchWrapper}`}>
      {!isOnUserDeclarations && platforms.length > 1 && (
        <PlatformDropdown
          selectedPlatform={selectedPlatform}
          isProgramSelectionLocked={isProgramSelectionLocked}
          globalClass={`${className} ${platformSliderClass}`}
          platforms={platforms}
        />
      )}
      {!onlyPlatformsSlider && !!programs.length && (
        <>
          {isOnUserDeclarations && (
            <DynamicFormattedMessage
              tag={HTML_TAGS.P}
              className={`${textCenter} ${withFontSmall} ${programLabelClass}`}
              id="wall.userDeclarations.programs"
            />
          )}
          <ProgramDropdown globalClass={`${className} ${relative}`} programs={programs} />
        </>
      )}
    </div>
  );
};

export default GlobalSlider;
