import React, { useState, useEffect } from 'react';
import { Tabs, Tab, TabList, TabPanel } from 'react-tabs';

import GeneralBlock from 'components/molecules/block/GeneralBlock';
import CampaignList from 'components/organisms/communication/CampaignList';
import UserLists from 'components/organisms/communication/UserLists';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { HTML_TAGS } from 'constants/general';
import { WALL_COMMUNICATION_EMAIL_CAMPAIGNS_ROUTE, WALL_COMMUNICATION_USER_LIST_ROUTE } from 'constants/routes';

import style from 'sass-boilerplate/stylesheets/components/wall/WallSettingsBlock.module.scss';
import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';

/**
 * Page component used to render communication page
 *
 * @constructor
 */
const CommunicationPage = ({ isEmailCampaign, history }) => {
  const [index, setIndex] = useState(isEmailCampaign ? 0 : 1);
  const { settingsTabList, settingsTab, settingsActiveTab } = style;
  const { withGrayAccentColor, withBoldFont, mx5, mb0 } = coreStyle;

  const setTabIndex = i => {
    setIndex(i);
    history.push((i && WALL_COMMUNICATION_USER_LIST_ROUTE) || WALL_COMMUNICATION_EMAIL_CAMPAIGNS_ROUTE);
  };

  useEffect(() => {
    setIndex(isEmailCampaign ? 0 : 1);
  }, [isEmailCampaign]);

  return (
    <GeneralBlock className={mb0}>
      <Tabs selectedIndex={index} onSelect={setTabIndex}>
        <TabList className={settingsTabList}>
          <Tab
            className={`${settingsTab} ${withGrayAccentColor} ${withBoldFont} ${mx5}`}
            selectedClassName={settingsActiveTab}
          >
            <DynamicFormattedMessage tag={HTML_TAGS.P} id="communication.tab.campaign" />
          </Tab>
          <Tab
            className={`${settingsTab} ${withGrayAccentColor} ${withBoldFont} ${mx5}`}
            selectedClassName={settingsActiveTab}
          >
            <DynamicFormattedMessage tag={HTML_TAGS.P} id="communication.tab.list" />
          </Tab>
        </TabList>
        <TabPanel>
          <GeneralBlock isShadow={false}>
            <CampaignList />
          </GeneralBlock>
        </TabPanel>
        <TabPanel>
          <GeneralBlock isShadow={false}>
            <UserLists />
          </GeneralBlock>
        </TabPanel>
      </Tabs>
    </GeneralBlock>
  );
};

export default CommunicationPage;
