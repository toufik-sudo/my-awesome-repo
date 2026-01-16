import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

import store from 'store';
import ConnectedIntlProvider from 'containers/ConnectedIntlProvider';

/**
 * Wrapper component used to wrap components that requires additional providers
 *
 * @param children
 * @constructor
 */
const ProvidersWrapper = ({ children }) => {
  return (
    <Provider store={store}>
      <ConnectedIntlProvider>
        <BrowserRouter>{children}</BrowserRouter>
      </ConnectedIntlProvider>
    </Provider>
  );
};

export default ProvidersWrapper;
