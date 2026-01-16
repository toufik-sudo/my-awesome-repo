import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';

import AvatarPreview from 'components/organisms/avatar/AvatarPreview';
import { AvatarContext } from 'components/pages/PersonalInformationPage';

describe('AvatarPreview', () => {
  const wrapper: ShallowWrapper<{}> = shallow(
    <AvatarContext.Consumer>{() => <AvatarPreview />}</AvatarContext.Consumer>
  );

  test('renders without crashing', () => {
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.children()).toHaveLength(0);
  });
});
