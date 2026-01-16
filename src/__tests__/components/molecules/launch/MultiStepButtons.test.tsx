import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';

import MultiStepButtons from 'components/molecules/launch/MultiStepButtons';
import ProvidersWrapper from 'components/stories/utility/ProvidersWrapper';

describe('MultiStepButtons', () => {
  const wrapper: ShallowWrapper<{}> = shallow(
    <ProvidersWrapper>
      <MultiStepButtons />
    </ProvidersWrapper>
  );

  test('renders without crashing', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
