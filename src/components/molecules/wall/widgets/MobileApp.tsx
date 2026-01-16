import React from 'react';
import { useIntl } from 'react-intl';
import ReactTooltip from 'react-tooltip';

import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import GeneralBlock from 'components/molecules/block/GeneralBlock';
import { HTML_TAGS, IMAGES_ALT } from 'constants/general';
import { TOOLTIP_FIELDS } from 'constants/tootltip';

import apple from 'assets/images/apple.png';
import google from 'assets/images/google.png';
import phone from 'assets/images/phone.png';
import logo from 'assets/images/logo/logoColored.png';
import blockStyle from 'assets/style/components/PaymentMethod/PaymentMethod.module.scss';
import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';
import wallStyle from 'sass-boilerplate/stylesheets/components/wall/WallBasePageStructure.module.scss';
import widgetStyle from 'sass-boilerplate/stylesheets/components/wall/widgets/Widget.module.scss';

/**
 * Organism component used to render mobile app widget
 *
 * @constructor
 */
const MobileApp = () => {
  const {
    withBoldFont,
    withGrayAccentColor,
    imgFluid,
    py15,
    px0,
    pr15,
    mr3,
    displayBlock,
    mb15,
    mxAuto,
    width9,
    flexAlignItemsEnd
  } = coreStyle;
  const { widgetTitle, widgetCustomScale, widgetImage, widgetMobile } = widgetStyle;
  const { blockDisabled } = blockStyle;
  const { formatMessage } = useIntl();

  const mobileAppIntl = 'mobile.app.download.';

  return (
    <GeneralBlock className={`${withGrayAccentColor} ${widgetMobile} ${py15} ${px0} ${wallStyle.hideBlockMobile}`}>
      <div
        className={`${coreStyle['flex-center-horizontal']} ${flexAlignItemsEnd} ${widgetCustomScale} ${blockDisabled}`}
        data-tip={formatMessage({ id: 'comingSoon' })}
      >
        <img alt={IMAGES_ALT.PHONE} src={phone} className={widgetImage} />
        <div className={pr15}>
          <img src={logo} className={`${imgFluid} ${width9} ${mxAuto} ${displayBlock} ${mb15}`} alt={IMAGES_ALT.LOGO} />
          <p className={`${mb15} ${widgetTitle}`}>
            <DynamicFormattedMessage tag={HTML_TAGS.SPAN} id={`${mobileAppIntl}label`} />
            <DynamicFormattedMessage tag={HTML_TAGS.STRONG} id={`${mobileAppIntl}label.bold`} />
          </p>
          <DynamicFormattedMessage
            tag={HTML_TAGS.P}
            className={`${mb15} ${withBoldFont} ${widgetTitle}`}
            id={`${mobileAppIntl}features`}
          />

          <div className={coreStyle['flex-center-vertical']}>
            <img
              src={google}
              className={`${mr3}`}
              // onClick={() => window.open(GOOGLE_PLAY)}
              alt={IMAGES_ALT.GOOGLE_PLAY}
            />
            <img
              src={apple}
              //onClick={() => window.open(APP_STORE)}
              alt={IMAGES_ALT.APP_STORE}
            />
          </div>
        </div>
      </div>
      <ReactTooltip place={TOOLTIP_FIELDS.PLACE_BOTTOM} effect={TOOLTIP_FIELDS.EFFECT_SOLID} />
    </GeneralBlock>
  );
};

export default MobileApp;
