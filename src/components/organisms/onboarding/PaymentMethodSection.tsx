import React from 'react';

import HeadingAtom from 'components/atoms/ui/Heading';
import RegisterPaymentMethodBlockList from 'components/molecules/onboarding/RegisterPaymentMethodBlockList';
import style from 'assets/style/components/LeftSideLayout.module.scss';

/**
 * Organism component that renders a payment method section with child blocks
 */
const PaymentMethodSection = () => {
  const { container, basicContainer } = style;

  return (
    <div className={`${container} ${basicContainer}`}>
      <HeadingAtom size="3" textId="paymentMethod.title" className="primary" />
      <RegisterPaymentMethodBlockList />
    </div>
  );
};

export default PaymentMethodSection;
