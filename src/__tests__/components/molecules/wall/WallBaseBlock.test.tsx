import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';

import WallBaseBlock from 'components/molecules/wall/blocks/WallBaseBlock';
import ProvidersWrapper from 'components/stories/utility/ProvidersWrapper';

describe('WallBaseBlock', () => {
  const wrapper: ShallowWrapper<{}> = shallow(
    <ProvidersWrapper>
      <WallBaseBlock />
    </ProvidersWrapper>
  );

  test('renders without crashing', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
