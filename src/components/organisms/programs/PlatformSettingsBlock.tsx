import React, { useMemo } from 'react';
import { Tabs, Tab, TabList, TabPanel } from 'react-tabs';

import WallSettingsAdministrators from 'components/organisms/wall/WallSettingsAdministrators';
import GeneralBlock from 'components/molecules/block/GeneralBlock';
import LinkBack from 'components/atoms/ui/LinkBack';
import { PLATFORMS_ROUTE, SETTINGS, WALL_PROGRAM_ROUTE } from 'constants/routes';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { HTML_TAGS } from 'constants/general';
import { PAYMENT } from 'constants/wall/settings';
import { useTabNavigation } from 'hooks/general/useTabNavigation';
import { getPlatformSettingTabs } from 'services/wall/settings';

import style from 'sass-boilerplate/stylesheets/components/wall/WallSettingsBlock.module.scss';
import componentStyle from 'sass-boilerplate/stylesheets/components/wall/WallBasePageStructure.module.scss';
import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';
import PaymentMethodBlockList from 'components/molecules/onboarding/PaymentMethodBlockList';
import Accordion from 'components/organisms/accordion/Accordion';
import { useLocation } from 'react-router-dom';

/**
 * Organism component used to render settings block/tabs
 *
 * @constructor
 */
const PlatformSettingsBlock = ({ platform }) => {
  const langKeyPrefix = 'wall.settings.';
  const { settingsTabList, settingsTab, settingsActiveTab } = style;
  const {
    withGrayAccentColor,
    withBoldFont,
    pointer,
    mt3,
    mt0,
    textLeft,
    withPrimaryColor,
    mLargeMt7,
    withDefaultTextColor,
    pt2,
    dMediumPx0
  } = coreStyle;
  const { wallCenterBlock } = componentStyle;
  const tabHeaders = useMemo(() => getPlatformSettingTabs(platform), [platform]);
  const { index, setTabIndex } = useTabNavigation(
    tabHeaders,
    `${PLATFORMS_ROUTE}/${platform.hierarchicType}${SETTINGS}/${platform.id}`
  );
  const { state } = useLocation<any>();

  return (
    <GeneralBlock className={`${mt0} ${wallCenterBlock} ${mLargeMt7}`}>
      <LinkBack className={`${withPrimaryColor} ${textLeft}`} to={WALL_PROGRAM_ROUTE} messageId="programs.list.back" />
      <Tabs selectedIndex={index} onSelect={setTabIndex}>
        <TabList className={settingsTabList}>
          {tabHeaders.map(objKey => (
            <Tab
              key={objKey}
              className={`${settingsTab} ${withGrayAccentColor} ${withBoldFont}`}
              selectedClassName={`${settingsActiveTab} ${withDefaultTextColor}`}
            >
              <DynamicFormattedMessage tag={HTML_TAGS.SPAN} id={`${langKeyPrefix}${objKey}`} className={pointer} />
            </Tab>
          ))}
        </TabList>

        <TabPanel>
          <div className={mt3}>
            <WallSettingsAdministrators platform={platform} />
          </div>
        </TabPanel>
        {tabHeaders.includes(PAYMENT) && (
          <TabPanel>
            <GeneralBlock className={dMediumPx0} isShadow={false}>
              <Accordion
                shouldBeOpened={state && state.fromSetCard}
                title={<DynamicFormattedMessage id="payment.rewards.title" tag={HTML_TAGS.P} />}
              >
                <div className={pt2}>
                  <DynamicFormattedMessage id="payment.rewards.points.info" tag={HTML_TAGS.P} />
                  <DynamicFormattedMessage id="payment.rewards.points.label" tag={HTML_TAGS.P} />
                </div>
                <PaymentMethodBlockList platformId={platform.id} />
              </Accordion>
            </GeneralBlock>
          </TabPanel>
        )}
        <TabPanel>GDPR</TabPanel>
      </Tabs>
    </GeneralBlock>
  );
};

export default PlatformSettingsBlock;
