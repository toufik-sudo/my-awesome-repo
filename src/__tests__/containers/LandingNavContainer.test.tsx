import ConnectedIntlProvider from 'containers/ConnectedIntlProvider';
import LandingNavContainer from 'containers/LandingNavContainer';
import { mount, ReactWrapper } from 'enzyme';
import React, { ReactElement } from 'react';
import { Provider } from 'react-redux';
import store from 'store';
import { BrowserRouter } from 'react-router-dom';

describe('LandingNavContainer', () => {
  const element: ReactElement = (
    <Provider store={store}>
      <ConnectedIntlProvider>
        <BrowserRouter>
          <LandingNavContainer setActive={jest.fn()} />
        </BrowserRouter>
      </ConnectedIntlProvider>
    </Provider>
  );

  const wrapper: ReactWrapper = mount(element);
  test('renders without crashing', () => {
    const navbar = wrapper.find('nav').props().style;

    if (navbar && navbar.background) {
      expect(navbar.background).toBe('brown');
    }
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.children().length).toBe(1);
  });
});
