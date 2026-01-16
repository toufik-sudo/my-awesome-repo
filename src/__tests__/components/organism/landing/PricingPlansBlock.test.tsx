import PricingPlans from 'components/organisms/landing/PricingPlans';
import { INITIAL_SLIDE, PRICING_BLOCK_TYPES } from 'constants/landing';
import { shallow, ShallowWrapper } from 'enzyme';
import React from 'react';

describe('PricingPlans', () => {
  const wrapper: ShallowWrapper<{}> = shallow(
    <PricingPlans
      pricingData={[]}
      initialSlide={INITIAL_SLIDE}
      type={PRICING_BLOCK_TYPES.SUBSCRIPTION}
      setActiveSlide={jest.fn()}
    />
  );

  test('renders without crashing', () => {
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.children()).toHaveLength(1);
    expect(wrapper.children().children()).toHaveLength(3);
  });
});
