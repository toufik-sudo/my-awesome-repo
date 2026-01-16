import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { mount, shallow, ShallowWrapper } from 'enzyme';

import App from 'components/App';
import NotFoundPage from 'components/pages/NotFoundPage';
import HomePage from 'components/pages/HomePage';
import store from 'store';
import ConnectedIntlProvider from 'containers/ConnectedIntlProvider';
import PricingPage from 'components/pages/PricingPage';
import MainRouter from 'components/router/MainRouter';
import { ENDPOINT_ARRAY_MOCK } from '__mocks__/apiMocks';
import { PRICING_ROUTE, ROOT } from 'constants/routes';

describe('React router should output the correct component if route is matched', () => {
  test('invalid path should redirect to 404', () => {
    const wrapper = mount(
      <Provider store={store}>
        <ConnectedIntlProvider>
          <MemoryRouter initialEntries={ENDPOINT_ARRAY_MOCK}>
            <App />
          </MemoryRouter>
        </ConnectedIntlProvider>
      </Provider>
    );

    expect(wrapper.find(HomePage)).toHaveLength(0);
    expect(wrapper.find(NotFoundPage)).toHaveLength(1);
  });

  test('homepage path should render home page component', () => {
    const wrapper = mount(
      <Provider store={store}>
        <ConnectedIntlProvider>
          <MemoryRouter initialEntries={[ROOT]}>
            <App />
          </MemoryRouter>
        </ConnectedIntlProvider>
      </Provider>
    );

    expect(wrapper.find(HomePage)).toHaveLength(1);
    expect(wrapper.find(NotFoundPage)).toHaveLength(0);
  });

  test('pricing path should render pricing page component', () => {
    const wrapper = mount(
      <Provider store={store}>
        <ConnectedIntlProvider>
          <MemoryRouter initialEntries={[PRICING_ROUTE]}>
            <App />
          </MemoryRouter>
        </ConnectedIntlProvider>
      </Provider>
    );

    expect(wrapper.find(PricingPage)).toHaveLength(1);
    expect(wrapper.find(NotFoundPage)).toHaveLength(0);
  });

  test('snapshot testing', () => {
    const wrapper: ShallowWrapper<{}> = shallow(
      <Provider store={store}>
        <ConnectedIntlProvider>
          <MainRouter />
        </ConnectedIntlProvider>
      </Provider>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
