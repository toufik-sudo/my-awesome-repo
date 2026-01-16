import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';

import ProvidersWrapper from 'components/stories/utility/ProvidersWrapper';
import AllocationTypeValidateCTA from 'components/atoms/launch/cube/AllocationTypeValdiateCTA';
import { MEASUREMENT_TYPES } from 'constants/wall/launch';

describe('AllocationTypeValidateCTA', () => {
  const wrapper: ShallowWrapper<{}> = shallow(
    <ProvidersWrapper>
      <AllocationTypeValidateCTA targetValue={MEASUREMENT_TYPES.QUANTITY} />
    </ProvidersWrapper>
  );

  test('renders without crashing', () => {
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.children().length).toBe(1);
  });
});
