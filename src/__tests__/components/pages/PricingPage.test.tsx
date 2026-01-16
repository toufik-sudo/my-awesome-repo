import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';

import PricingPage from 'components/pages/PricingPage';

describe('PricingPage', () => {
  const wrapper: ShallowWrapper<{}> = shallow(<PricingPage />);

  test('renders without crashing', () => {
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.children().length).toBe(1);
  });
});
