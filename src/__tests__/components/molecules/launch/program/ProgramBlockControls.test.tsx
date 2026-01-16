import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';

import ProvidersWrapper from 'components/stories/utility/ProvidersWrapper';
import ProgramBlockControls from 'components/molecules/launch/program/ProgramBlockControls';

describe('ProgramBlockControls', () => {
  const wrapper: ShallowWrapper<{}> = shallow(
    <ProvidersWrapper>
      <ProgramBlockControls buttons={<div />} imgFile="" index="1" programType="" titleId="test" />
    </ProvidersWrapper>
  );

  test('renders without crashing', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
