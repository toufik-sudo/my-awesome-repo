import React, { useState, useRef, useEffect, useContext } from 'react';
import { Tabs, Tab, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css'; // Import the styles for react-tabs
import LeftSideLayout from 'components/organisms/layouts/LeftSideLayout';
import { WALL_TYPE } from 'constants/general';
import { getUserAuthorizations } from 'services/security/accessServices';
import { useUserRole } from 'hooks/user/useUserRole';
import { UserContext } from 'components/App';
import AiRagComponent from './AiRagComponent';
import AiPersonnalisationComponent from './AiPersonnalisationComponent';
import { FormattedMessage, useIntl } from 'react-intl';

const AiComponentPage = () => {
  const { userData } = useContext(UserContext);
  const userRole = useUserRole();
  const { isHyperAdmin } = getUserAuthorizations(userRole);
  const companyName = String(userData.companyName); // Assuming companyName is defined somewhere
  const { formatMessage } = useIntl();
  return (
    <div className="">
      <LeftSideLayout theme={WALL_TYPE} hasUserIcon>
        <Tabs>
          <TabList>
            <Tab>{formatMessage({ id: "ai.tab.indexation"})}</Tab>
            {isHyperAdmin && <Tab>{formatMessage({id: "ai.tab.style"})}</Tab>}
          </TabList>

          <TabPanel>
            <AiRagComponent isHyperAdmin={isHyperAdmin} companyName={companyName} />
          </TabPanel>

          {isHyperAdmin && (
            <TabPanel>
              <AiPersonnalisationComponent />
            </TabPanel>
          )}
        </Tabs>
      </LeftSideLayout>
    </div>
  );
};

export default AiComponentPage;

