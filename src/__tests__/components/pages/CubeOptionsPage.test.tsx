import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';

import CubeOptionsPage from 'components/pages/CubeOptionsPage';
import ProvidersWrapper from 'components/stories/utility/ProvidersWrapper';

describe('CubeOptionsPage', () => {
  const wrapper: ShallowWrapper<{}> = shallow(
    <ProvidersWrapper>
      <CubeOptionsPage />
    </ProvidersWrapper>
  );

  test('renders without crashing', () => {
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.children().length).toBe(1);
  });
});
