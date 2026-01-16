import React from 'react';
import store from 'store';
import { Provider } from 'react-redux';
import { shallow, ShallowWrapper } from 'enzyme';

import PostsList from 'components/molecules/wall/PostsList';

describe('PostList', () => {
  const wrapper: ShallowWrapper<{}> = shallow(
    <Provider store={store}>
      <PostsList />
    </Provider>
  );

  test('renders without crashing', () => {
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.children()).toHaveLength(1);
  });
});
