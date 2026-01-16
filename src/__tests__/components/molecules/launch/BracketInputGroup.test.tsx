import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';

import ProvidersWrapper from 'components/stories/utility/ProvidersWrapper';
import BracketInputGroup from 'components/molecules/launch/cube/BracketInputGroup';

describe('BracketInputGroup', () => {
  const wrapper: ShallowWrapper<{}> = shallow(
    <ProvidersWrapper>
      <BracketInputGroup bracketData={{}} index={1} handleBracketInputChange={jest.fn()} condition="" target="" />
    </ProvidersWrapper>
  );

  test('renders without crashing', () => {
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.children().length).toBe(1);
  });
});
