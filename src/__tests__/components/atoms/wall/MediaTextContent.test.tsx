import React from 'react';
import store from 'store';
import { Provider } from 'react-redux';
import { shallow, ShallowWrapper } from 'enzyme';

import MediaTextContent from 'components/atoms/wall/MediaTextContent';
import { mockPost } from '__mocks__/wallMocks';

describe('PostContent', () => {
  const wrapper: ShallowWrapper<{}> = shallow(
    <Provider store={store}>
      <MediaTextContent content={mockPost.content} file={null} />
    </Provider>
  );

  test('renders without crashing', () => {
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.children()).toHaveLength(1);
  });
});
