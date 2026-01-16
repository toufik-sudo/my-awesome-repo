import React from 'react';
import store from 'store';
import { Provider } from 'react-redux';
import { shallow, ShallowWrapper } from 'enzyme';

import PostLikes from 'components/atoms/wall/PostLikes';
import { mockPost } from '__mocks__/wallMocks';

describe('PostLikes', () => {
  const wrapper: ShallowWrapper<{}> = shallow(
    <Provider store={store}>
      <PostLikes likes={mockPost.likes} />
    </Provider>
  );

  test('renders without crashing', () => {
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.children()).toHaveLength(1);
  });
});
