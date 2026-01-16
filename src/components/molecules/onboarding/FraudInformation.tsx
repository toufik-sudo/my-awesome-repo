import React from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch } from 'react-redux';

import { FRAUD_INFO_MODAL } from 'constants/modal';
import { setModalState } from 'store/actions/modalActions';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import style from 'assets/style/common/Labels.module.scss';

/**
 * Molecule component that renders fraud information text + cta
 *
 * @constructor
 */
const FraudInformation = () => {
  const dispatch = useDispatch();
  const { block, bold, center, link } = style;

  return (
    <div className={`${block} ${center}`}>
      <FormattedMessage id="personalInformation.info.fraud.title" />
      <DynamicFormattedMessage
        tag="span"
        className={`${bold} ${link}`}
        onClick={() => dispatch(setModalState(true, FRAUD_INFO_MODAL))}
        id="personalInformation.info.fraud.cta"
      />
    </div>
  );
};

export default FraudInformation;
