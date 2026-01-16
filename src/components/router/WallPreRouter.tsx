import React, { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect, Switch, useHistory, useLocation, useRouteMatch } from 'react-router-dom';

import { UserContext } from 'components/App';
import Loading from 'components/atoms/ui/Loading';
import { LOADER_TYPE } from 'constants/general';
import WallDashBoardLayout from 'components/organisms/wall/WallDashBoardLayout';
import ProtectedRoute from 'components/organisms/layouts/ProtectedRoute';
import WallRouter from 'components/router/WallRouter';
import { ALL_ROUTES, LOGIN_PAGE_ROUTE, METRICS_ROUTE, ONBOARDING_CUSTOM_WELCOME, PAGE_NOT_FOUND, WALL_PROGRAM_ROUTE, WALL_ROUTE } from 'constants/routes';
import { useStoredProgramData } from 'hooks/programs/useStoredProgramData';
import { useWallSelection } from 'hooks/wall/useWallSelection';
import { IStore } from 'interfaces/store/IStore';
import { getUserAuthorizations, hasAtLeastSuperRole, isUserBeneficiary } from 'services/security/accessServices';
import { setHandleRedirectOnLogin } from 'store/actions/generalActions';
import { forceActiveProgram } from 'store/actions/wallActions';
// import useProgramsList from 'hooks/programs/useProgramsList';
// import { initializeDates } from 'services/AgendaServices';
// import {getUserUuid} from "../../services/UserDataServices";
// import {IUserProgramsSearchCriteria} from "../../interfaces/api/IUserProgramsSearchCriteria";
// import {PROGRAMS, USERS_ENDPOINT} from "../../constants/api";
// import axiosInstance from "../../config/axiosConfig";
// import {DEFAULT_PROGRAMS_QUERY} from "../../constants/api/userPrograms";
import UserApi from "../../api/UsersApi";
import { AUTHORIZATION_TOKEN } from 'constants/general';
import Cookies from 'js-cookie';


/**
 * Router component used to set layouts and include the correct routes for wall
 * @constructor
 */
const WallPreRouter = () => {
  const routerMatch = useRouteMatch();
  const history = useHistory();
  const dispatch = useDispatch();
  const { componentLoading, userData } = useContext(UserContext);
  const { platforms, loadingPlatforms } = useWallSelection();
  const { programDetails } = useStoredProgramData();
  const { redirectOnLogin } = useSelector((store: IStore) => store.generalReducer);
  const [isLoading, setIsLoading] = useState(false);
  const [programs, setPrograms] = useState([]);
  // const isAuthenticated = useSelector((store: IStore) => store.generalReducer.userLoggedIn);
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const programId = Number(query.get('programId'));
  const platformId = Number(query.get('platformId'));
  const programName = query.get('programName');

  // const {
  //   programs,
  //   onFilter,
  //   userRole,
  //   onChangePlatform,
  //   selectedPlatform,
  //   triggerReloadPrograms,
  //   isLoading
  // } = useProgramsList();

  // if the user is redirected to wall from a program onboarding login/mail and the platform or program he
  // tries to access is not in the selector, we redirect him to the programs page for that platform/program,
  // to let him join that program
  // const checkAndRedirectForNotJoinedPrograms = programDetails => {
  //   console.log("WallPreRouter checkAndRedirectForNotJoinedPrograms!");
  //   const checkedPlatform = platforms.find(platform => platform.id == programDetails.platformId);
  //   const checkedPlatformProgram =
  //     checkedPlatform && checkedPlatform.programs.find(program => program.id == programDetails.programId);
  //   if (!checkedPlatform || !checkedPlatformProgram) {
  //     const redirectPath = `${WALL_PROGRAM_ROUTE}/${programDetails.programType}/${programDetails.programId}/${programDetails.customUrl}`;
  //     history.push(redirectPath);
  //   }
  // };

  const getUserProgramsByPlatforms = async (uuid) => {
    try {
      setIsLoading(true);
      const userApi = new UserApi();
      const searchCriteria = {
        uuid: uuid
      }
      const {
        data: { platforms }
      } = await userApi.getUserPrograms(searchCriteria);
      return Promise.resolve({ platforms });
    } catch (e) {
      console.error(e);
      return Promise.resolve({ platforms: [] });
    }
  }

  const setUserPrograms = (platforms) => {
    if (platforms?.length > 0) {
      let programsArray = [];
      platforms.forEach(platform => {
        if (platform.nrOfPrograms >= 1) {
          platform.programs.forEach(program => {
            programsArray.push(program);
          });
        }
      });
      setPrograms(programsArray);
    }
  }

  const checkUserStatus = (programsData) => {
    const isNoPrograms = !programsData || programs?.length == 0;
    if (isNoPrograms) {
      return false;
    }

    let isUserNotJoinedPrograms = false;
    programsData.forEach(program => {
      if (program.programUserStatus != 3 && program.programUserStatus) {
        isUserNotJoinedPrograms = true;
      }
      // if(program.programUserAdminStatus){
      //   isUserNotJoinedPrograms = false;
      // }
    });

    return isUserNotJoinedPrograms;
  }

  const checkExistingPrograms = (platforms) => {
    let obj = { isNbrOfPrograms: false, subPlatform: {} };
    if (platforms?.length > 0) {
      platforms.forEach(platform => {
        if (platform.nrOfPrograms >= 1) {
          obj.isNbrOfPrograms = true;
          obj.subPlatform = platform;
          return true;
        }
      });
    }
    return obj;
  }

  useEffect(() => {
    const authorizationToken = Cookies.get(AUTHORIZATION_TOKEN);
    // console.log("AUTHORIZATION_TOKEN : " + authorizationToken)
    const isAuthenticated = !!authorizationToken;
    const progId = programId == 0 ? null : programId;
    if (progId && !isAuthenticated) {
      const url = `${ONBOARDING_CUSTOM_WELCOME}?platformId=${platformId}&programId=${programId}&programName=${programName}`;
      history.push(url)
      return;
    }
    if (!progId && !isAuthenticated) {
      history.push(LOGIN_PAGE_ROUTE)
      return;
    }
    if (!isAuthenticated) {
      history.push(LOGIN_PAGE_ROUTE)
      return;
    }

    if (componentLoading) {
      return;
    }
    const { highestRole, roles } = userData;

    const { isSuperAdmin, isSuperManager, isHyperAdmin, isBeneficiary, isAdmin } = getUserAuthorizations(highestRole);

    const ensureSubPlatformPreselected = isSuperAdmin || isSuperManager;

    if (redirectOnLogin && isUserBeneficiary(highestRole) && userData && !isLoading && programs?.length == 0) {
      console.log("WallPreRouter getUserProgramsByPlatforms!");
      getUserProgramsByPlatforms(userData.uuid).then(
        (response) => {
          setUserPrograms(response.platforms);
        }, (error) => {
          setPrograms([]);
        }
      ).finally(() => setIsLoading(false));
    }

    // if (!loadingPlatforms && programDetails && programDetails.programId && programDetails.programType && isUserBeneficiary(highestRole)) {
    //   checkAndRedirectForNotJoinedPrograms(programDetails);
    // }

    if (redirectOnLogin && (isLoading || loadingPlatforms)) {
      return;
    }

    dispatch(setHandleRedirectOnLogin(false));
    // loadingPlatforms is a flag which we can use to verify if platform retrieval is finished
    // if (ensureSubPlatformPreselected && loadingPlatforms) {
    //   // history.push(WALL_ROUTE);
    //   return;
    // }

    // if the user is not a super/hyper admin, we check if he has joined any program, if not we redirect him to the programs page
    if (redirectOnLogin && !isLoading && (isBeneficiary || !roles || roles && roles.length == 0)) {
      // if(!programs || programs?.length == 0 || programs?.length == 1 && (programs[0]?.programUserStatus == 3 ||
      //   !programs.programUserStatus && !programs[0].platform?.programs[0]?.programUserAdminStatus)) {
      if (!checkUserStatus(programs)) {
        history.push(WALL_PROGRAM_ROUTE);
        return;
      } else {
        // history.push(WALL_ROUTE);
        return;
      }
    }
    // else if (!(redirectOnLogin && hasAtLeastSuperRole(highestRole))) {
    //   // history.push(WALL_PROGRAM_ROUTE);
    //   return;
    // }
    else if (redirectOnLogin) {
      // dispatch(setHandleRedirectOnLogin(false));
      if (isAdmin || ensureSubPlatformPreselected) {
        // since super/hyper platforms are not saved in the platforms store, the first element for a super/hyper role
        // will be the subplatform
        const checkPlatforms = checkExistingPrograms(platforms);
        if (checkPlatforms.isNbrOfPrograms) {
          const subPlatform = checkPlatforms.subPlatform;
          dispatch(forceActiveProgram({ forcedPlatformId: subPlatform.id, unlockSelection: true }));
          return;
        } else {
          history.push(WALL_PROGRAM_ROUTE);
          return;
        }
      } else if (redirectOnLogin) {
        history.push(isHyperAdmin ? METRICS_ROUTE : WALL_ROUTE);
      }
    }
  }, [userData, redirectOnLogin, history, platforms, loadingPlatforms, isLoading]);
  // }, [userData, redirectOnLogin]);



  if (componentLoading || loadingPlatforms || isLoading) {
    return <Loading type={LOADER_TYPE.PAGE} />;
  }

  return (
    <WallDashBoardLayout>
      <Switch>
        <ProtectedRoute path={routerMatch.path} component={WallRouter} />
        <Redirect from={ALL_ROUTES} to={PAGE_NOT_FOUND} />
      </Switch>
    </WallDashBoardLayout>
  );
};

export default WallPreRouter;
