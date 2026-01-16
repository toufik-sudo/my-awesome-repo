import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';

import ProvidersWrapper from 'components/stories/utility/ProvidersWrapper';
import Bracket from 'components/organisms/launch/cube/Bracket';

describe('Bracket', () => {
  const wrapper: ShallowWrapper<{}> = shallow(
    <ProvidersWrapper>
      <Bracket bracketData={{}} index={1} bracketsData={[]} goalIndex={1} setBracketsData={jest.fn()} />
    </ProvidersWrapper>
  );

  test('renders without crashing', () => {
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.children().length).toBe(1);
  });
});
