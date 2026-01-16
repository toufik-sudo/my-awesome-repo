import { transformPricingBaseMock } from '__mocks__/pricingMocks';
import PricingRow from 'components/molecules/landing/PricingRow';
import { shallow, ShallowWrapper } from 'enzyme';
import React from 'react';

describe('LandingPricingRow', () => {
  test('renders without crashing', () => {
    const wrapper: ShallowWrapper<{}> = shallow(
      <PricingRow pricingElement={transformPricingBaseMock} columnIndex={0} />
    );

    expect(wrapper).toMatchSnapshot();
  });
});
