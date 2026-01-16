import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';

import WallPreRouter from 'components/router/WallPreRouter';
import ProvidersWrapper from 'components/stories/utility/ProvidersWrapper';

describe('WallPreRouter', () => {
  const wrapper: ShallowWrapper<{}> = shallow(
    <ProvidersWrapper>
      <WallPreRouter />
    </ProvidersWrapper>
  );

  test('renders without crashing', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
