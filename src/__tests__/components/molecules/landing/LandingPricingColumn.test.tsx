import { transformPricingBaseMock } from '__mocks__/pricingMocks';
import PricingColumn from 'components/molecules/landing/PricingColumn';
import { shallow, ShallowWrapper } from 'enzyme';
import React from 'react';

describe('LandingPricingColumn', () => {
  const wrapper: ShallowWrapper<{}> = shallow(PricingColumn([transformPricingBaseMock])[0]);

  test('renders without crashing', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
