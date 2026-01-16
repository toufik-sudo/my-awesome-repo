import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { Redirect } from 'react-router-dom';

import GoalOptionsFormWrapper from 'components/organisms/form-wrappers/GoalOptionsFormWrapper';
import GoalOptionsOptionButton from './GoalOptionsOptionsButton';
import GoalOptionsAlert from './GoalOptionsAlert';
import { GOAL_OPTIONS_FIRST_FORMS, GOAL_OPTIONS_SECOND_FORMS } from 'constants/formDefinitions/formDeclarations';
import { LAUNCH_FIRST } from 'constants/routes';
import { SPONSORSHIP } from 'constants/wall/launch';
import { useQuickSimpleAllocation } from 'hooks/launch/rewards/useQuickSimpleAllocation';

import tabStyle from 'assets/style/common/Tabs.module.scss';

/**
 * Organism component that renders the tabs and panels for Goal Options
 *
 * @constructor
 */
const GoalOptionsWrapper = () => {
  const { tab, tabList, tabItem, tabItemSelected } = tabStyle;
  const {
    type,
    selectedIndex,
    handleTabSelect,
    isChallengeProgram,
    isLoyaltyProgram,
    simpleAllocation
  } = useQuickSimpleAllocation();

  if (!type) return <Redirect to={LAUNCH_FIRST} />;

  return (
    <Tabs className={tab} onSelect={handleTabSelect} selectedIndex={selectedIndex}>
      {type !== SPONSORSHIP && (
        <TabList className={`${tabList} ${isChallengeProgram || isLoyaltyProgram ? '' : 'hidden'}`}>
          <Tab className={tabItem} selectedClassName={tabItemSelected}>
            <GoalOptionsOptionButton challengeText="revenue" loyaltyText="purchaseAmount" />
          </Tab>
          <Tab className={tabItem} selectedClassName={tabItemSelected}>
            <GoalOptionsOptionButton challengeText="salesVolume" loyaltyText="purchaseNo" />
          </Tab>
        </TabList>
      )}
      <TabPanel>
        <GoalOptionsAlert loyaltyText="purchaseAmount" challengeText="revenue" sponsorshipText={SPONSORSHIP} />
        <GoalOptionsFormWrapper typeOfGoalOptions={GOAL_OPTIONS_FIRST_FORMS(simpleAllocation)[type]} />
      </TabPanel>
      <TabPanel>
        <GoalOptionsAlert loyaltyText="purchases" challengeText="sales" sponsorshipText={SPONSORSHIP} />
        <GoalOptionsFormWrapper typeOfGoalOptions={GOAL_OPTIONS_SECOND_FORMS(simpleAllocation)[type]} />
      </TabPanel>
    </Tabs>
  );
};

export default GoalOptionsWrapper;
