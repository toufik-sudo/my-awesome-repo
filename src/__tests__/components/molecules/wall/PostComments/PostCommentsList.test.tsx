import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';

import PostCommentList from 'components/molecules/wall/commentsBlock/PostCommentList';
import ProvidersWrapper from 'components/stories/utility/ProvidersWrapper';

describe('PostCommentList', () => {
  const wrapper: ShallowWrapper<{}> = shallow(
    <ProvidersWrapper>
      <PostCommentList type={1} />
    </ProvidersWrapper>
  );

  test('renders without crashing', () => {
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.children()).toHaveLength(1);
  });
});
