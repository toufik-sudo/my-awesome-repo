import React from 'react';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom';

import WallBaseBlock from 'components/molecules/wall/blocks/WallBaseBlock';
import SettingsMainBlock from 'components/organisms/wall/SettingsMainBlock';
import WallDashboardMainBlock from 'components/organisms/wall/WallDashboardMainBlock';
import NotificationsList from 'components/organisms/notifications/NotificationsList';
import ProgramPointsList from 'components/organisms/wall/dashboard/beneficiary/ProgramPointsList';
import BeneficiaryRankingList from 'components/molecules/wall/ranking/BeneficiaryRankingList';
import CreateBeneficiaryDeclarationPage from 'components/pages/wall/CreateBeneficiaryDeclarationPage';
import Loading from 'components/atoms/ui/Loading';
import AuthorizedRoute from 'components/organisms/layouts/AuthorizedRoute';
import DashboardUpgradePlan from 'components/organisms/wall/dashboard/DashboardUpgradePlan';

import {
  ALL_ROUTES,
  PAGE_NOT_FOUND,
  SETTINGS,
  DASHBOARD_WALL,
  NOTIFICATIONS_ROUTE,
  UPGRADE_PLAN,
  ECARD_CONVERSION
} from 'constants/routes';
import { BENEFICIARY_POINTS, RANKING, CREATE_DECLARATION } from 'constants/api';
import { FIRST_SETTINGS_TAB } from 'constants/wall/settings';
import { useWallSelection } from 'hooks/wall/useWallSelection';
import { LOADER_TYPE } from 'constants/general';
import { ROLE, ALL_ROLES_EXCEPT_BENEFICIARY } from 'constants/security/access';
import EcardPage from 'components/pages/EcardPage';

/**
 * Router component used to render wall inside routes
 * @constructor
 */
const WallRouter = () => {
  const routerMatch = useRouteMatch();
  const { loadingPlatforms } = useWallSelection();
  if (loadingPlatforms) {
    return <Loading type={LOADER_TYPE.DROPZONE} />;
  }

  const beneficiaryOnly = [ROLE.BENEFICIARY];

  return (
    <Switch>
      <AuthorizedRoute
        authorizedRoles={beneficiaryOnly}
        exact
        path={`${routerMatch.path}/${BENEFICIARY_POINTS}`}
        component={ProgramPointsList}
      />
      <AuthorizedRoute
        authorizedRoles={beneficiaryOnly}
        exact
        path={`${routerMatch.path}/${RANKING}`}
        component={BeneficiaryRankingList}
      />
      <AuthorizedRoute
        authorizedRoles={beneficiaryOnly}
        exact
        path={`${routerMatch.path}/${CREATE_DECLARATION}`}
        component={CreateBeneficiaryDeclarationPage}
      />
      <Route exact path={`${routerMatch.path}${SETTINGS}/:tab`} component={SettingsMainBlock} />
      <Route exact path={`${routerMatch.path}${ECARD_CONVERSION}`} component={EcardPage} />
      <Redirect
        exact
        from={`${routerMatch.path}${SETTINGS}`}
        to={`${routerMatch.path}${SETTINGS}/${FIRST_SETTINGS_TAB}`}
      />
      <AuthorizedRoute exact path={`${routerMatch.path}${NOTIFICATIONS_ROUTE}`} component={NotificationsList} />
      <AuthorizedRoute
        authorizedRoles={ALL_ROLES_EXCEPT_BENEFICIARY}
        exact
        path={`${routerMatch.path}/${DASHBOARD_WALL}`}
        component={WallDashboardMainBlock}
      />
      <AuthorizedRoute exact path={`${routerMatch.path}${UPGRADE_PLAN}`} component={DashboardUpgradePlan} />
      <AuthorizedRoute exact path={routerMatch.path} component={WallBaseBlock} />
      <Redirect from={ALL_ROUTES} to={PAGE_NOT_FOUND} />
    </Switch>
  );
};

export default WallRouter;
