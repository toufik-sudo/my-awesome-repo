import React from 'react';
import store from 'store';
import { shallow, ShallowWrapper } from 'enzyme';
import { Provider } from 'react-redux';

import PostAuthorDetails from 'components/atoms/wall/PostAuthorDetails';
import { mockPost } from '__mocks__/wallMocks';

describe('PostAuthorDetails', () => {
  const wrapper: ShallowWrapper<{}> = shallow(
    <Provider store={store}>
      <PostAuthorDetails post={mockPost} />
    </Provider>
  );

  test('renders without crashing', () => {
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.children()).toHaveLength(1);
  });
});
