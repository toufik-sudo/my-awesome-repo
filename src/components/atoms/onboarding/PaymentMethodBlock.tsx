import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDispatch } from 'react-redux';

import Button from 'components/atoms/ui/Button';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import ConfirmationModal from 'components/organisms/modals/ConfirmationModal';
import { HTML_TAGS } from 'constants/general';
import { CONFIRMATION_MODAL } from 'constants/modal';
import { PAYMENT_ICONS } from 'constants/paymentMethod';
import { BUTTON_MAIN_TYPE } from 'constants/ui';
import useContactUsModal from 'hooks/modals/useContactUsModal';
import { setModalState } from 'store/actions/modalActions';

import blockStyle from 'assets/style/components/BlockElement.module.scss';
import style from 'assets/style/components/PaymentMethod/PaymentMethod.module.scss';

/**
 * Atom component that renders a reusable payment method block
 *
 * @param textId
 * @param index
 * @param platformId
 */
const PaymentMethodBlock = ({ textId, index, platformId }) => {
  const dispatch = useDispatch();
  const { title, block } = style;
  const { contactUs, closeModal } = useContactUsModal();
  const onClickContactUs = index => {
    dispatch(setModalState(true, CONFIRMATION_MODAL));
    contactUs(index, platformId);
  };

  return (
    <div className={`${blockStyle.fullWidthBlock} ${block}`}>
      <FontAwesomeIcon icon={PAYMENT_ICONS[index]} />
      <DynamicFormattedMessage tag={HTML_TAGS.DIV} className={title} id={textId} />
      <DynamicFormattedMessage
        tag={Button}
        type={BUTTON_MAIN_TYPE.PRIMARY}
        onClick={() => onClickContactUs(index + 1)}
        id={'paymentMethod.contactUs'}
      />
      <ConfirmationModal
        onAccept={closeModal}
        onClose={closeModal}
        question="contactUs.modal.text"
        confirmLabel="contactUs.cta.yes"
        denyLabel="contactUs.cta.no"
        showCloseButton={false}
      />
    </div>
  );
};

export default PaymentMethodBlock;
