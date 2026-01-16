import PricingLabelsList from 'components/molecules/landing/PricingLabelsList';
import { shallow, ShallowWrapper } from 'enzyme';
import React from 'react';
import { Provider } from 'react-redux';
import index from 'store';

describe('LandingLabelsBlock', () => {
  const wrapper: ShallowWrapper<{}> = shallow(
    <Provider store={index}>
      <PricingLabelsList priceOrder={[]} />
    </Provider>
  );

  test('renders without crashing', () => {
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.children().length).toBe(1);
  });
});
