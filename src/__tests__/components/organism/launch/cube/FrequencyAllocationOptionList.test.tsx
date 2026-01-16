import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';

import ProvidersWrapper from 'components/stories/utility/ProvidersWrapper';
import FrequencyAllocationOptionList from 'components/organisms/launch/cube/FrequencyAllocationOptionList';

describe('FrequencyAllocationOptionList', () => {
  const wrapper: ShallowWrapper<{}> = shallow(
    <ProvidersWrapper>
      <FrequencyAllocationOptionList frequencyTypes={[]} selectedFrequency={{}} setSelectedFrequency={jest.fn()} />
    </ProvidersWrapper>
  );

  test('renders without crashing', () => {
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.children().length).toBe(1);
  });
});
