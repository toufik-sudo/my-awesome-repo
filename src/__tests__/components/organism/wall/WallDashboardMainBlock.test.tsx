import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';

import WallDashboardMainBlock from 'components/organisms/wall/WallDashboardMainBlock';
import ProvidersWrapper from 'components/stories/utility/ProvidersWrapper';

describe('WallDashboardMainBlock', () => {
  const wrapper: ShallowWrapper<{}> = shallow(
    <ProvidersWrapper>
      <WallDashboardMainBlock />
    </ProvidersWrapper>
  );

  test('renders without crashing', () => {
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.children()).toHaveLength(1);
  });
});
