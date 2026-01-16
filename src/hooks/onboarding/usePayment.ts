import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { toast } from 'react-toastify';
import { useIntl } from 'react-intl';

import { STRIPE_API_KEY } from 'config/paymentConfig';
import { getSessionId } from 'store/actions/boardingActions';

/**
 * Hook used to handle payment method data
 */
export const usePayment = () => {
  const { formatMessage } = useIntl();
  const [isLoading, setLoading] = useState(false);
  const [errorId, setErrorId] = useState(null);

  const handlePayment = async () => {
    setLoading(true);
    try {
      const stripe = await loadStripe(STRIPE_API_KEY);
      const sessionId = await getSessionId();
      await stripe.redirectToCheckout({ sessionId });
    } catch ({ response, ...rest }) {
      setErrorId(response.data.code);
      toast(formatMessage({ id: 'toast.message.generic.error' }));
    } finally {
      setLoading(false);
    }
  };

  return { handlePayment, isLoading, errorId };
};
