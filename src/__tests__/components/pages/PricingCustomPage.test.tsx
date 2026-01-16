import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';

import PricingCustomPage from 'components/pages/PricingCustomPage';

describe('PricingCustomPage', () => {
  const wrapper: ShallowWrapper<{}> = shallow(<PricingCustomPage />);

  test('renders without crashing', () => {
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.children().length).toBe(1);
  });
});
