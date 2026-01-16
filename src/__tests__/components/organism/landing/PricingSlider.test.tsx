import React from 'react';
import { shallow } from 'enzyme';
import { Provider } from 'react-redux';

import PricingSlider from 'components/organisms/landing/PricingSlider';
import store from 'store';

describe('PricingSlider', () => {
  const wrapper = shallow(
    <Provider store={store}>
      <PricingSlider setActiveSlide={jest.fn()} pricingData={{}} type="" initialSlide="" />
    </Provider>
  );

  test('renders without crashing', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
