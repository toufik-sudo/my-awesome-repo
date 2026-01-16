import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';

import { RESELLER_MODAL } from 'constants/modal';
import { IStore } from 'interfaces/store/IStore';
import { setModalState } from 'store/actions/modalActions';

/**
 * Container used to render reseller modal template component (ResellerModal.tsx)
 *
 * @param children
 * @constructor
 */
const ResellerModalContainer = ({ children }) => {
  const dispatch = useDispatch();
  const resellerModalState = useSelector(state => (state as IStore).modalReducer.resellerModal);
  const intl = useIntl();
  const closeResellerModal = () => dispatch(setModalState(false, RESELLER_MODAL));

  return children({ closeResellerModal, intl, resellerModalState: resellerModalState.active });
};

export default ResellerModalContainer;
