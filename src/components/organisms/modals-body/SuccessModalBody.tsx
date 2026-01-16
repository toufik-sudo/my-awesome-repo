import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import HeadingAtom from 'components/atoms/ui/Heading';
import Button from 'components/atoms/ui/Button';
import { AUTO_CLOSE_TIME } from 'constants/forms';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { LOGIN_PAGE_ROUTE, ONBOARDING_BENEFICIARY_LOGIN_ROUTE, PRICING, ROOT } from 'constants/routes';
import { BUTTON_MAIN_VARIANT } from 'constants/ui';

import style from 'assets/style/components/Modals/Modal.module.scss';

/**
 * Ogranism component used to render success modal body
 *
 * @param closeModal
 * @param closeButtonHidden
 * @param data
 * @param isResetModal
 * @param isOnboardingFlow
 * @constructor
 */
const SuccessModalBody = ({ onClick: closeModal, closeButtonHidden, data, isResetModal, isOnboardingFlow }) => {
  const { subtitle, wrapper, closeBtn } = style;
  const [timeOutRef, setTimeOutRef] = useState(null);

  // Auto close success widget
  useEffect(() => {
    setTimeOutRef(
      setTimeout(() => {
        closeModal();
      }, AUTO_CLOSE_TIME)
    );
  }, [closeModal]);
  const history = useHistory();
  const loginPageRoute = isOnboardingFlow ? ONBOARDING_BENEFICIARY_LOGIN_ROUTE : LOGIN_PAGE_ROUTE;

  return (
    <div className={wrapper}>
      <HeadingAtom textId={`modal.success.title${data.type || ''}`} size="2" />
      <DynamicFormattedMessage tag="div" className={subtitle} id={`modal.success.body${data.type || ''}`} />
      {!closeButtonHidden && (
        <DynamicFormattedMessage
          tag={Button}
          onClick={() => {
            history.push({
              pathname: isResetModal ? loginPageRoute : `${ROOT}`,
              state: { forcedActiveSection: PRICING }
            });
            closeModal();
            timeOutRef && clearTimeout(timeOutRef);
          }}
          variant={BUTTON_MAIN_VARIANT.INVERTED}
          id={`modal.success.button${data.type || ''}`}
        />
      )}
      <FontAwesomeIcon
        className={`${closeBtn} ${closeModal} `}
        onClick={() => {
          closeModal();
          timeOutRef && clearTimeout(timeOutRef);
        }}
        icon={faTimes}
      />
    </div>
  );
};

export default SuccessModalBody;
