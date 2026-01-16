import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { Provider } from 'react-redux';

import SubscriptionSection from 'components/organisms/onboarding/SubscriptionSection';
import store from 'store';

describe('SubscriptionSection', () => {
  test('renders without crashing and the children is rendered accordingly', () => {
    const wrapper: ShallowWrapper<{}> = shallow(
      <Provider store={store}>
        <SubscriptionSection />
      </Provider>
    );

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.children()).toHaveLength(1);
  });
});
