import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';

import WallRouter from 'components/router/WallRouter';
import ProvidersWrapper from 'components/stories/utility/ProvidersWrapper';

describe('WallRouter', () => {
  const wrapper: ShallowWrapper<{}> = shallow(
    <ProvidersWrapper>
      <WallRouter />
    </ProvidersWrapper>
  );

  test('renders without crashing', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
