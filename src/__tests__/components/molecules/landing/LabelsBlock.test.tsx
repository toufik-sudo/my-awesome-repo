import React from 'react';
import { shallow } from 'enzyme';

import PricingLabelsList from 'components/molecules/landing/PricingLabelsList';

describe('PricingLabelsList', () => {
  const wrapper = shallow(<PricingLabelsList type={'subscription'} />);

  test('renders without crashing', () => {
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.children()).toHaveLength(1);
    expect(wrapper.children().children()).toHaveLength(14);
  });
});
