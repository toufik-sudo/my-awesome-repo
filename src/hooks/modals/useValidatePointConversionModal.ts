import { useDispatch, useSelector } from 'react-redux';

import { IStore } from 'interfaces/store/IStore';
import { VALIDATE_POINT_CONVERSION_MODAL } from 'constants/modal';
import { validatePointConversion } from 'store/actions/formActions';
import { setModalState } from 'store/actions/modalActions';

/**
 * Hook used to manage validation of point conversions modal actions
 * */
const useValidatePointConversionModal = onSuccess => {
  const dispatch = useDispatch();
  const validatePointConversionModalState = useSelector(
    (state: IStore) => state.modalReducer.validatePointConversionModal
  );
  const closeModal = () => dispatch(setModalState(false, VALIDATE_POINT_CONVERSION_MODAL));

  const confirmModal = () => {
    const { pointConversion } = validatePointConversionModalState.data;
    if (pointConversion) {
      validatePointConversion(pointConversion).then(() => onSuccess({ id: pointConversion.id }));
    }
    closeModal();
  };
  return { validatePointConversionModalState, closeModal, confirmModal };
};

export default useValidatePointConversionModal;
