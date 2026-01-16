import React from 'react';
import { mount } from 'enzyme';

import LaunchProgramType from 'components/molecules/launch/program/LaunchProgramType';
import ProvidersWrapper from 'components/stories/utility/ProvidersWrapper';

describe('LaunchProgramType', () => {
  const wrapper = mount(
    <ProvidersWrapper>
      <LaunchProgramType />
    </ProvidersWrapper>
  );

  test('renders without crashing', () => {
    expect(wrapper).toMatchSnapshot();
    expect(
      wrapper
        .find(LaunchProgramType)
        .at(0)
        .children()
    ).toHaveLength(2);
  });
});
