import React from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

import FlexibleModalContainer from 'containers/FlexibleModalContainer';
import { FRAUD_INFO_MODAL } from 'constants/modal';
import { IStore } from 'interfaces/store/IStore';
import { setModalState } from 'store/actions/modalActions';
import style from 'assets/style/components/Modals/Modal.module.scss';

/**
 * Organism component used to render fraud info modal
 *
 * @constructor
 */
const FraudInfoModal = () => {
  const { closeBtn, modalBaseStyleBody, modalDefaultOverlay, modalDefaultTitle, modalDefault } = style;
  const dispatch = useDispatch();
  const fraudModalState = useSelector(state => (state as IStore).modalReducer.fraudInfoModal);
  const closeResellerModal = () => dispatch(setModalState(false, FRAUD_INFO_MODAL));

  return (
    <FlexibleModalContainer
      isModalOpen={fraudModalState.active}
      closeModal={closeResellerModal}
      className={modalDefault}
      overlayClassName={modalDefaultOverlay}
    >
      <div className={modalBaseStyleBody}>
        <button onClick={closeResellerModal} className={closeBtn}>
          <FontAwesomeIcon icon={faTimes} />
        </button>
        <div>
          <h2 className={modalDefaultTitle}>
            <FormattedMessage id="personalInformation.info.fraud.modal.title" />
          </h2>
          <p>
            <FormattedMessage id="personalInformation.info.fraud.modal.content1" />
          </p>
          <p>
            <FormattedMessage id="personalInformation.info.fraud.modal.content2" />
          </p>
        </div>
      </div>
    </FlexibleModalContainer>
  );
};

export default FraudInfoModal;
