import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';

import LeftNavigationElement from 'components/atoms/wall/LeftNavigationElement';
import { Provider } from 'react-redux';
import store from 'store';

describe('LeftNavigationElement', () => {
  const wrapper: ShallowWrapper<{}> = shallow(
    <Provider store={store}>
      <LeftNavigationElement title={''} url={''} icon={''} />
    </Provider>
  );

  test('renders without crashing', () => {
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.children()).toHaveLength(1);
  });
});
