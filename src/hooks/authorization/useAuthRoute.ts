import { LOGIN } from 'constants/routes';
import { useState } from 'react';

/**
 * Hook used to keep state for login route (default/forgot)
 */
export const useAuthRoute = () => {
  const [loginState, setLoginState] = useState(LOGIN);
  const setLoginRoute = target => setLoginState(target);

  return { setLoginRoute, loginState };
};
