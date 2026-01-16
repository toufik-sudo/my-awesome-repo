import { Buffer } from 'buffer';
(window as any).Buffer = Buffer;
(window as any).process = (window as any).process || { env: {} };

import 'babel-polyfill';
import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';

import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import { Provider } from 'react-redux';
import store from './store';
import { BrowserRouter } from 'react-router-dom';
import ConnectedIntlProvider from './containers/ConnectedIntlProvider';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import 'rc-slider/assets/index.css';
import 'sass-boilerplate/stylesheets/global-imports.scss';

ReactDOM.render(
  <Provider store={store}>
    <ConnectedIntlProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ConnectedIntlProvider>
  </Provider>,
  document.getElementById('root')
);
