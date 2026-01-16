import LandingSection from 'components/organisms/landing/LandingSection';
import IntlProvider from 'containers/ConnectedIntlProvider';
import { shallow, ShallowWrapper } from 'enzyme';
import React from 'react';
import { Provider } from 'react-redux';
import store from 'store';

describe('LandingSection', () => {
  const wrapper: ShallowWrapper<{}> = shallow(
    <Provider store={store}>
      <IntlProvider>
        <LandingSection />
      </IntlProvider>
    </Provider>
  );

  test('renders without crashing', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
