import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';

import ProvidersWrapper from 'components/stories/utility/ProvidersWrapper';
import CubeRadioValidate from 'components/atoms/launch/cube/CubeRadioValidate';

describe('CubeRadioValidate', () => {
  const wrapper: ShallowWrapper<{}> = shallow(
    <ProvidersWrapper>
      <CubeRadioValidate action={jest.fn()} payload={{}} type={true} />
    </ProvidersWrapper>
  );

  test('renders without crashing', () => {
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.children().length).toBe(1);
  });
});
