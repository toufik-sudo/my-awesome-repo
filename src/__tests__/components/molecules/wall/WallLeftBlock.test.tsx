import React from 'react';
import store from 'store';
import { Provider } from 'react-redux';
import { shallow, ShallowWrapper } from 'enzyme';

import WallLeftBlock from 'components/molecules/wall/blocks/WallLeftBlock';

describe('WallLeftBlock', () => {
  const wrapper: ShallowWrapper<{}> = shallow(
    <Provider store={store}>
      <WallLeftBlock />
    </Provider>
  );

  test('renders without crashing', () => {
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.children()).toHaveLength(1);
  });
});
