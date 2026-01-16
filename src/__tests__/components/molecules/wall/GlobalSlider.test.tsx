import React from 'react';
import store from 'store';
import { Provider } from 'react-redux';
import { shallow, ShallowWrapper } from 'enzyme';

import GlobalSlider from 'components/molecules/wall/globalSlider/GlobalSlider';
import { INITIAL_SLIDE } from 'constants/landing';

describe('Global slider', () => {
  const wrapper: ShallowWrapper<{}> = shallow(
    <Provider store={store}>
      <GlobalSlider />
    </Provider>
  );

  test('renders without crashing', () => {
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.children()).toHaveLength(1);
  });
});
