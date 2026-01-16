import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';

import PostComments from 'components/atoms/wall/PostComments';
import ProvidersWrapper from 'components/stories/utility/ProvidersWrapper';

describe('PostComments', () => {
  const wrapper: ShallowWrapper<{}> = shallow(
    <ProvidersWrapper>
      <PostComments nrOfComments={10} showComments={true} setShowComments={jest.fn()} id={''} type={1} />
    </ProvidersWrapper>
  );

  test('renders without crashing', () => {
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.children()).toHaveLength(1);
  });
});
