import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useIntl } from 'react-intl';
import { toast } from 'react-toastify';

import UserApi from 'api/UsersApi';
import { useWallSelection } from 'hooks/wall/useWallSelection';
import {
  getUserAuthorizations,
  isAnyKindOfAdmin,
  isAnyKindOfManager,
  isUserBeneficiary
} from 'services/security/accessServices';
import { getUserCookie } from 'utils/general';
import { setUserBeneficiaryPoints } from 'store/actions/wallActions';
import { USER_COOKIE_FIELDS } from 'constants/general';
import {
  getCurrentProgramPoints,
  getPlatformTotalPoints,
  mapBeneficiaryPointsPrograms,
  mapSelectedBeneficiaryPoints
} from 'services/wall/blocks';
import usePrevious from 'hooks/general/usePrevious';
import { useUserRole } from 'hooks/user/useUserRole';
import axios from 'axios';

const userApi = new UserApi();

/**
 * Hook used to get and set current user points in store and state.
 */
const useDashboardNumber = () => {
  const [isPointsComponentLoading, setPointComponentLoading] = useState(false);
  const [adminPointsData, setAdminPlatformPoints] = useState<any>({});
  const [adminPoints, setAdminPoints] = useState(0);
  const role = useUserRole();
  const {
    selectedProgramId,
    selectedPlatform: { id },
    beneficiaryPoints: { reloadKey, platformProgramsPointsList, selectedBeneficiaryPoints, totalPlatformsPoints }
  } = useWallSelection();
  const prevReloadKey = usePrevious(reloadKey);
  const isBeneficiary = isUserBeneficiary(role);
  const dispatch = useDispatch();
  const { formatMessage } = useIntl();
  const userRights = getUserAuthorizations(role);
  const isAdminOrManager = isAnyKindOfAdmin(userRights) || isAnyKindOfManager(userRights);

  const loadAdminData = () => {
    setPointComponentLoading(true);
    userApi
      .getUserPoints(id)
      .then(data => {
        if (data) {
          setAdminPlatformPoints(data.data);
        }
      })
      .catch(() => {
        // toast(formatMessage({ id: 'wall.beneficiary.points.error.loading' }))
      })
      .finally(() => setPointComponentLoading(false));
  };

  useEffect(() => {
    const source = axios.CancelToken.source();
    if (platformProgramsPointsList.length && prevReloadKey === reloadKey) {
      return;
    }
    setPointComponentLoading(true);
    userApi.getBeneficiaryPoints(getUserCookie(USER_COOKIE_FIELDS.UUID), source)
      .then(({ data }) => {
        dispatch(setUserBeneficiaryPoints(mapBeneficiaryPointsPrograms(data.platforms)));
      })
      .catch(() => {
        // toast(formatMessage({ id: 'wall.beneficiary.points.error.loading' }))
      })
      .finally(() => setPointComponentLoading(false));
      return()=>{
        source.cancel();
      }
  }, [reloadKey]);

  useEffect(() => {
    if (!id || !platformProgramsPointsList.length) {
      return;
    }

    dispatch(
      setUserBeneficiaryPoints(
        mapSelectedBeneficiaryPoints(id, selectedProgramId, platformProgramsPointsList, totalPlatformsPoints)
      )
    );
  }, [id, selectedProgramId, platformProgramsPointsList]);

  useEffect(() => {
    if (isAdminOrManager) {
      id && loadAdminData();
    }
  }, [id]);

  useEffect(() => {
    if (!adminPointsData.totalPoints) {
      return;
    }
    setAdminPoints(adminPointsData.totalPoints);
    if (selectedProgramId && adminPointsData.platforms) {
      setAdminPoints(getCurrentProgramPoints(adminPointsData, selectedProgramId));
    }
  }, [selectedProgramId, adminPointsData]);

  return {
    points: isAdminOrManager
      ? adminPoints
      : getPlatformTotalPoints(totalPlatformsPoints, id, selectedBeneficiaryPoints),
    isBeneficiary,
    isPointsComponentLoading
  };
};

export default useDashboardNumber;
