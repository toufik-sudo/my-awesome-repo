import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';

import PostsSummaryMessage from 'components/atoms/wall/PostsSummaryMessage';
import ProvidersWrapper from 'components/stories/utility/ProvidersWrapper';

describe('PostsSummaryMessage', () => {
  const wrapper: ShallowWrapper<{}> = shallow(
    <ProvidersWrapper>
      <PostsSummaryMessage />
    </ProvidersWrapper>
  );

  test('renders without crashing', () => {
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.children()).toHaveLength(1);
  });
});
