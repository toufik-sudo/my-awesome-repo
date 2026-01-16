import React from 'react';

import PaymentMethodBlock from 'components/atoms/onboarding/PaymentMethodBlock';
import { PAYMENT_METHODS } from 'constants/subscription';

import styles from 'assets/style/components/PaymentMethod/PaymentMethod.module.scss';

/**
 * Molecule component used to render payment method block list
 *
 * @constructor
 */
const PaymentMethodBlockList = ({ platformId }) => {
  return (
    <div className={styles.wrapper}>
      {PAYMENT_METHODS.map((key, index) => (
        <PaymentMethodBlock key={key} textId={`paymentMethod.type.${key}`} index={index} platformId={platformId} />
      ))}
    </div>
  );
};

export default PaymentMethodBlockList;
