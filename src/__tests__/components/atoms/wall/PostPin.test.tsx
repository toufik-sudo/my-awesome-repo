import React from 'react';
import store from 'store';
import { Provider } from 'react-redux';
import { shallow, ShallowWrapper } from 'enzyme';

import PostPin from 'components/atoms/wall/PostPin';
import { mockPost } from '__mocks__/wallMocks';

describe('PostPin', () => {
  const wrapper: ShallowWrapper<{}> = shallow(
    <Provider store={store}>
      <PostPin isPinned={mockPost.isPinned} />
    </Provider>
  );

  test('renders without crashing', () => {
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.children()).toHaveLength(1);
  });
});
