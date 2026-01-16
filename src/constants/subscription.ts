export const FREQUENCY_TYPE = ['annual', 'semiannual', 'quarterly', 'monthly'];
export const EMPTY_TRANSLATION = '.empty';

export const FREQUENCY_FIELDS = ({ frequencyType, discount }) => ({
  frequencyType: `subscription.frequency.${FREQUENCY_TYPE[frequencyType - 1]}`,
  pricePerMonth: `subscription.payment.month`,
  discount: `subscription.payment.discount${!discount ? EMPTY_TRANSLATION : ''}`,
  paymentValue: `subscription.payment.price.${FREQUENCY_TYPE[frequencyType - 1]}`
});

export const CARD = 'card';
export const PAYPAL = 'paypal';
export const TRANSFER = 'transfer';
export const PAYMENT_METHODS = [CARD, PAYPAL, TRANSFER];
