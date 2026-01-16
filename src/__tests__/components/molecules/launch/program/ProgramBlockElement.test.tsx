import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';

import ProvidersWrapper from 'components/stories/utility/ProvidersWrapper';
import ProgramBlockElement from 'components/molecules/launch/program/ProgramBlockElement';

describe('ProgramBlockElement', () => {
  const wrapper: ShallowWrapper<{}> = shallow(
    <ProvidersWrapper>
      <ProgramBlockElement buttons={<div />} imgFile="" index="1" programType="" textId="test" titleId="test" />
    </ProvidersWrapper>
  );

  test('renders without crashing', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
