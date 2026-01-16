import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';

import UserNumberWidget from 'components/molecules/wall/widgets/UserNumberWidget';
import ProvidersWrapper from 'components/stories/utility/ProvidersWrapper';

describe('WallUserBlock', () => {
  const wrapper: ShallowWrapper<{}> = shallow(
    <ProvidersWrapper>
      <UserNumberWidget />
    </ProvidersWrapper>
  );

  test('renders without crashing', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
