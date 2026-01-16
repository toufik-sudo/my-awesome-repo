import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';

import RewardsIntermediaryPage from '../../../../components/organisms/launch/rewards/RewardsIntermediaryPage';
import ProvidersWrapper from '../../../../components/stories/utility/ProvidersWrapper';

describe('RewardsIntermediaryPage', () => {
  const wrapper: ShallowWrapper<{}> = shallow(
    <ProvidersWrapper>
      <RewardsIntermediaryPage />
    </ProvidersWrapper>
  );

  test('renders without crashing', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
