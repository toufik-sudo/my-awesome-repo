import React from 'react';

import RegisterPaymentMethodBlock from 'components/atoms/onboarding/RegisterPaymentMethodBlock';
import Loading from 'components/atoms/ui/Loading';
import DynamicFormattedError from 'components/atoms/ui/DynamicFormattedError';
import { usePayment } from 'hooks/onboarding/usePayment';
import { LOADER_TYPE } from 'constants/general';
import { PAYMENT_METHODS } from 'constants/subscription';

import styles from 'assets/style/components/PaymentMethod/PaymentMethod.module.scss';

/**
 * Molecule component used to render payment method block list
 *
 * @constructor
 */
const RegisterPaymentMethodBlockList = () => {
  const { handlePayment, isLoading, errorId } = usePayment();

  if (isLoading) return <Loading type={LOADER_TYPE.FULL_PAGE} />;

  return (
    <div className={styles.wrapper}>
      {PAYMENT_METHODS.map((key, index) => (
        <RegisterPaymentMethodBlock
          key={key}
          textId={`paymentMethod.type.${key}`}
          index={index}
          onClick={handlePayment}
        />
      ))}
      <DynamicFormattedError hasError={errorId} id={`form.validation.${errorId}`} />
    </div>
  );
};

export default RegisterPaymentMethodBlockList;
