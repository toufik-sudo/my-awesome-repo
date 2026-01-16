import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useIntl } from 'react-intl';
import { toast } from 'react-toastify';

import { USER_DATA_COOKIE } from 'constants/general';
import { LAUNCH, WALL_PROGRAM_ROUTE, WALL_ROUTE } from 'constants/routes';
import {
  BASE_GOAL_VALUE,
  CUBE,
  DECLARATION_FORM,
  EMAIL_NOTIFY,
  FILE_IMPORT,
  INITIAL_SIMPLE_ALLOCATION,
  LAUNCH_PROGRAM_FIRST,
  MANUAL_VALIDATION,
  RESULTS_CHANNEL,
  RESULTS_MANUAL_VALIDATION
} from 'constants/wall/launch';
import { launchStepManager, setStoreData } from 'store/actions/launchActions';
import { useWallSelection } from 'hooks/wall/useWallSelection';
import { canCreateProgramsOnPlatform } from 'services/PlatformSelectionServices';
import { getUserPlatform } from 'services/UserDataServices';
import { hasFreePlan } from 'utils/general';

/**
 * Method gets the current launch data set on the step and check if requirements for this step are
 * met and if not, redirect the user to the last step where the requirements for the set data are met
 *
 * @param launchData
 */
export const useLaunchData = launchData => {
  const dispatch = useDispatch();
  const { formatMessage } = useIntl();
  const didMountRef = useRef(false);
  const history = useHistory();
  const { selectedPlatform } = useWallSelection();

  useEffect(() => {
    const isOnLaunchPage = history.location.pathname.includes(LAUNCH);
    //TODO: clarify: can user still launch programs for platform from token ??
    const platform = selectedPlatform.id ? selectedPlatform : getUserPlatform();

    if (isOnLaunchPage && !canCreateProgramsOnPlatform(platform)) {
      toast(formatMessage({ id: 'toast.launch.platform.cannotCreateProgram' }));
      history.push(WALL_ROUTE);
      return;
    }

    const isFirstStepPage = history.location.pathname === LAUNCH_PROGRAM_FIRST;
    if (!isOnLaunchPage || isFirstStepPage) {
      localStorage.removeItem(USER_DATA_COOKIE);
      dispatch(
        setStoreData({
          [RESULTS_CHANNEL]: {
            [DECLARATION_FORM]: false,
            [FILE_IMPORT]: false
          },
          [EMAIL_NOTIFY]: false,
          [MANUAL_VALIDATION]: false,
          [RESULTS_MANUAL_VALIDATION]: false,
          simpleAllocation: INITIAL_SIMPLE_ALLOCATION,
          [CUBE]: {
            goals: [{ ...BASE_GOAL_VALUE, validated: { ...BASE_GOAL_VALUE.validated } }],
            acceptedCorrelatedGoals: [],
            cubeValidated: {
              frequencyAllocation: false,
              spendType: false,
              validityPoints: false,
              rewardPeopleManagers: false
            },
            frequencyAllocation: '',
            spendType: '',
            rewardPeopleManagers: 0,
            rewardPeopleManagerAccepted: true,
            validityPoints: { value: '1y', label: '1 Year' }
          },
          platform,
          isFreePlan: hasFreePlan(platform)
        })
      );
    }
  }, [history.location.pathname, selectedPlatform, formatMessage]);

  useEffect(() => {
    if (!(didMountRef.current || history.action !== 'PUSH')) {
      localStorage.setItem(USER_DATA_COOKIE, JSON.stringify(launchData));
    }
  }, [launchData]);

  useEffect(() => {
    const launchDataCookie = localStorage.getItem(USER_DATA_COOKIE);
    if (launchDataCookie) {
      launchData = JSON.parse(launchDataCookie);
      dispatch(setStoreData(launchData));
    }
    if (history.location.pathname.includes(LAUNCH) && !history.location.pathname.includes(WALL_PROGRAM_ROUTE)) {
      launchStepManager(launchData, history);
    }
  }, []);

  return launchData;
};
