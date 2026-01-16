import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';

import AvatarWrapper from 'components/organisms/avatar/AvatarWrapper';
import { AvatarContext } from 'components/pages/PersonalInformationPage';

describe('AvatarWrapper', () => {
  const wrapper: ShallowWrapper<{}> = shallow(
    <AvatarContext.Consumer>{() => <AvatarWrapper />}</AvatarContext.Consumer>
  );

  test('renders without crashing', () => {
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.children()).toHaveLength(0);
  });
});
