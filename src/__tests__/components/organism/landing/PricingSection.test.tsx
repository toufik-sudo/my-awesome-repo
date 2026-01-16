import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { Provider } from 'react-redux';

import PricingSection from 'components/organisms/landing/PricingSection';
import store from 'store';

describe('PricingSection', () => {
  const wrapper = shallow(
    <Provider store={store}>
      <PricingSection />
    </Provider>
  );

  test('renders without crashing', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
