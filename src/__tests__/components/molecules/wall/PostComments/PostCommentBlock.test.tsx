import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';

import PostCommentsBlock from 'components/molecules/wall/commentsBlock/PostCommentsBlock';
import ProvidersWrapper from 'components/stories/utility/ProvidersWrapper';

describe('PostCommentsBlock', () => {
  const wrapper: ShallowWrapper<{}> = shallow(
    <ProvidersWrapper>
      <PostCommentsBlock showMore={jest.fn()} userData={{}} id={''} noOfComments={10} type={1} />
    </ProvidersWrapper>
  );

  test('renders without crashing', () => {
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.children()).toHaveLength(1);
  });
});
