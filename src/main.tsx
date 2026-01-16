import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';
import { Provider } from 'react-redux';
import store from './store';
import { BrowserRouter } from 'react-router-dom';
import ConnectedIntlProvider from './containers/ConnectedIntlProvider';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import 'rc-slider/assets/index.css';
import 'sass-boilerplate/stylesheets/global-imports.scss';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <ConnectedIntlProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ConnectedIntlProvider>
    </Provider>
  </React.StrictMode>
);
