import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';

import PostAuthorizeIcon from 'components/atoms/wall/PostAuthorizeIcon';
import ProvidersWrapper from 'components/stories/utility/ProvidersWrapper';

describe('PostAuthorizeIcon', () => {
  const wrapper: ShallowWrapper<{}> = shallow(
    <ProvidersWrapper>
      <PostAuthorizeIcon confidentialityType={1} id={123} selectedProgramId={12} />
    </ProvidersWrapper>
  );

  test('renders without crashing', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
