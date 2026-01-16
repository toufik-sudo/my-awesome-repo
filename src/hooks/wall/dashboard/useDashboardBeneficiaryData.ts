import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { useIntl } from 'react-intl';

import PointsApi from 'api/PointsApi';
import { useWallSelection } from 'hooks/wall/useWallSelection';
import { setActiveProgramData, setIsProgramSelectionLocked, setUserBeneficiaryPoints } from 'store/actions/wallActions';
import { isUserBeneficiary } from 'services/security/accessServices';
import { POINTS_CONVERSION_STATUSES, POINTS_CONVERSION_STATUS } from 'constants/wall/points';

const pointsApi = new PointsApi();
/**
 * Hook used to get and set current selectedProgram in store
 */
const useDashboardBeneficiaryPoints = () => {
  const [isFirstScroll, setIsFirstScroll] = useState(true);
  const [listReloadKey, setListReloadKey] = useState(0);
  const { formatMessage } = useIntl();
  const {
    selectedProgramId,
    selectedPlatform: { role, id },
    beneficiaryPoints: { platformProgramsPointsList, reloadKey }
  } = useWallSelection();

  useEffect(() => {
    setListReloadKey(listReloadKey + 1);
  }, [platformProgramsPointsList]);

  const isBeneficiary = isUserBeneficiary(role);
  const dispatch = useDispatch();

  const scrollElement = elementName => {
    const myElement = document.getElementById(elementName);
    const topPos = myElement && myElement.offsetTop;

    window.scrollTo({
      top: topPos - 100,
      behavior: 'smooth'
    });
  };

  const setSelectedProgramAndPlatform = selectedProgram => {
    setIsFirstScroll(false);
    dispatch(setActiveProgramData(selectedProgram.selectedProgramId));
    dispatch(setIsProgramSelectionLocked(false));
    scrollElement(selectedProgram.selectedProgramId);
  };

  const onCashOutPoints = async (programId, points) => {
    try {
      const { status } = await pointsApi.convertPoints({ programId, points });
      await dispatch(setUserBeneficiaryPoints({ reloadKey: reloadKey + 1 }));
      const pointsStatus = POINTS_CONVERSION_STATUSES[status];
      if (!pointsStatus) {
        throw new Error();
      }
      if (pointsStatus === POINTS_CONVERSION_STATUS.PENDING)
        return toast(formatMessage({ id: 'toast.message.points.conversion.adminAccept.notification' }));
      if (pointsStatus === POINTS_CONVERSION_STATUS.SUCCESS)
        return toast(formatMessage({ id: 'toast.message.points.conversion.accepted' }));
      if (pointsStatus === POINTS_CONVERSION_STATUS.DECLINED)
        return toast(formatMessage({ id: 'toast.message.points.conversion.declined' }));
    } catch (e) {
      toast(formatMessage({ id: 'toast.message.generic.error' }));
    }
  };

  return {
    platformProgramsPointsList,
    setSelectedProgramAndPlatform,
    isBeneficiary,
    selectedProgramId,
    scrollElement,
    isFirstScroll,
    listReloadKey,
    onCashOutPoints,
    id
  };
};

export default useDashboardBeneficiaryPoints;
