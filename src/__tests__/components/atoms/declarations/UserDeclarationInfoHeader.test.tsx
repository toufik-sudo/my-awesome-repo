import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';

import ProvidersWrapper from 'components/stories/utility/ProvidersWrapper';
import UserDeclarationInfoHeader from 'components/atoms/declarations/UserDeclarationInfo';

describe('UserDeclarationInfoHeader', () => {
  const wrapper: ShallowWrapper<{}> = shallow(
    <ProvidersWrapper>
      <UserDeclarationInfoHeader id={123} program={{ type: 1, name: 'test' }} />
    </ProvidersWrapper>
  );

  test('renders without crashing', () => {
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.children()).toHaveLength(1);
  });
});
