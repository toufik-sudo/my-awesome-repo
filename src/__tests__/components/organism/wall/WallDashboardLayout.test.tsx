import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';

import ProvidersWrapper from 'components/stories/utility/ProvidersWrapper';
import WallDashBoardLayout from 'components/organisms/wall/WallDashBoardLayout';

describe('WallDashboardRouter', () => {
  const wrapper: ShallowWrapper<{}> = shallow(
    <ProvidersWrapper>
      <WallDashBoardLayout>
        <></>
      </WallDashBoardLayout>
    </ProvidersWrapper>
  );

  test('renders without crashing', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
