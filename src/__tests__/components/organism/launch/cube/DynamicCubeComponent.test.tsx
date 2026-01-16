import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';

import ProvidersWrapper from 'components/stories/utility/ProvidersWrapper';
import DynamicCubeComponent from 'components/organisms/launch/cube/DynamicCubeComponent';
import { SIMPLE } from 'constants/wall/launch';

describe('DynamicCubeComponent', () => {
  const wrapper: ShallowWrapper<{}> = shallow(
    <ProvidersWrapper>
      <DynamicCubeComponent tag={SIMPLE} index="1" />
    </ProvidersWrapper>
  );

  test('renders without crashing', () => {
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.children().length).toBe(1);
  });
});
