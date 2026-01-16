import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';

import LaunchProgramRowList from 'components/organisms/launch/program/LaunchProgramRowList';
import ProvidersWrapper from 'components/stories/utility/ProvidersWrapper';

describe('LaunchProgramRowList', () => {
  const wrapper: ShallowWrapper<{}> = shallow(
    <ProvidersWrapper>
      <LaunchProgramRowList imgFile="" sectionText="" />
    </ProvidersWrapper>
  );

  test('renders without crashing', () => {
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.children().length).toBe(1);
  });
});
