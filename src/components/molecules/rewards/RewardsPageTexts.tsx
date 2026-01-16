import React from 'react';
import { Link } from 'react-router-dom';
import { useIntl } from 'react-intl';
import ReactTooltip from 'react-tooltip';

import Button from 'components/atoms/ui/Button';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { HTML_TAGS } from 'constants/general';
import { WALL_BENEFICIARY_POINTS_ROUTE } from 'constants/routes';
import { BUTTON_MAIN_TYPE } from 'constants/ui';
import { TOOLTIP_FIELDS } from 'constants/tootltip';

import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';

/**
 * Component used to render text part of the rewards page
 * @constructor
 */
const RewardsPageTexts = () => {
  const langPrefix = 'rewards.page.';
  const intl = useIntl();

  return (
    <div>
      <DynamicFormattedMessage
        tag={HTML_TAGS.H3}
        className={`${coreStyle.withFontXLarge} ${coreStyle.mb2} ${coreStyle.withGrayAccentColor} ${coreStyle.textCenter} ${coreStyle.mt8} ${coreStyle.pt5}`}
        id={`${langPrefix}title`}
      />
      <DynamicFormattedMessage
        tag={HTML_TAGS.P}
        className={`${coreStyle.smallText} ${coreStyle.mb2} ${coreStyle.textCenter}`}
        id={`${langPrefix}description`}
      />
      <DynamicFormattedMessage
        tag={HTML_TAGS.P}
        className={`${coreStyle.withTextMedium} ${coreStyle.withGrayAccentColor} ${coreStyle.withBoldFont} ${coreStyle.mb2} ${coreStyle.textCenter}`}
        id={`${langPrefix}cta1.label`}
      />
      <Link to={WALL_BENEFICIARY_POINTS_ROUTE}>
        <DynamicFormattedMessage
          tag={Button}
          className={`${coreStyle.withFontSmall} ${coreStyle.withGrayAccentColor} ${coreStyle.mb4} ${coreStyle.textCenter}  ${coreStyle.withLightFont} ${coreStyle.mxAuto} ${coreStyle.displayBlock}`}
          id={`${langPrefix}cta1.text`}
        />
      </Link>
      <DynamicFormattedMessage
        tag={HTML_TAGS.P}
        className={`${coreStyle.withFontMedium} ${coreStyle.withGrayAccentColor} ${coreStyle.withLightFont} ${coreStyle.mb2} ${coreStyle.textCenter}`}
        id={`${langPrefix}cta2.label`}
      />
      {/*put on hold for now since this should redirect to the beneficiaries top up page*/}
      {/*<Link to={`/${WALL}${SETTINGS}${PAYMENT}`}>*/}
      <div data-tip={intl.formatMessage({ id: 'notAvailable' })}>
        <DynamicFormattedMessage
          tag={Button}
          type={BUTTON_MAIN_TYPE.DISABLED}
          className={`${coreStyle.withFontMedium} ${coreStyle.withGrayAccentColor} ${coreStyle.mb4} ${coreStyle.withLightFont} ${coreStyle.textCenter} ${coreStyle.mxAuto} ${coreStyle.displayBlock}`}
          id={`${langPrefix}cta2.text`}
          title="Coming soon"
        />
        <ReactTooltip
          place={TOOLTIP_FIELDS.PLACE_BOTTOM}
          type={TOOLTIP_FIELDS.TYPE_ERROR}
          effect={TOOLTIP_FIELDS.EFFECT_SOLID}
        />
      </div>
      {/*</Link>*/}
    </div>
  );
};

export default RewardsPageTexts;
