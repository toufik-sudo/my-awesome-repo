import React from 'react';

import CompanyColorSingle from 'components/molecules/launch/design/CompanyColorSingle';
import { CUSTOMISE_COLORS } from 'constants/wall/design';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { useCompanyColorsList } from 'hooks/launch/design/useCompanyColorsList';
import { HTML_TAGS } from 'constants/general';

import style from 'assets/style/components/launch/Design.module.scss';
import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';

/**
 * Organism component used to render company colors list
 * @constructor
 */
const CompanyColorsList = () => {
  const { handleResetColors, resetColors } = useCompanyColorsList();
  const { colorsInline, designColorsTitle } = style;
  return (
    <>
      {CUSTOMISE_COLORS.map((colorData, index) => (
        <>
          {colorData.colors && (
            <>
              <DynamicFormattedMessage
                className={designColorsTitle}
                tag={HTML_TAGS.P}
                values={{ index: ++index }}
                id={`launchProgram.design.${colorData.name}`}
              />
              <div className={`${colorsInline} ${coreStyle.flex}`}>
                {colorData.colors.map((colorData, index) => (
                  <CompanyColorSingle key={index} {...{ index, colorData, resetColors }} />
                ))}
              </div>
            </>
          )}
          {!colorData.colors && (
            <>
              <DynamicFormattedMessage
                className={designColorsTitle}
                tag={HTML_TAGS.P}
                values={{ index: ++index }}
                id={`launchProgram.design.${colorData.name}`}
              />
              <CompanyColorSingle
                key={index}
                {...{ index, colorData: { color: colorData.color, name: colorData.name }, resetColors }}
              />
            </>
          )}
        </>
      ))}
      <DynamicFormattedMessage
        className={style.designColorsReset}
        tag="p"
        id="launchProgram.design.customiseColors.reset"
        onClick={handleResetColors}
      />
    </>
  );
};

export default CompanyColorsList;
