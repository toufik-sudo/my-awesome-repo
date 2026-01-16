import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';

import { AvatarContext } from 'components/pages/PersonalInformationPage';
import AvatarEditor from 'components/organisms/avatar/AvatarEditor';

describe('AvatarEditor', () => {
  const wrapper: ShallowWrapper<{}> = shallow(
    <AvatarContext.Consumer>{() => <AvatarEditor closeModal={jest.fn()} />}</AvatarContext.Consumer>
  );

  test('renders without crashing', () => {
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.children()).toHaveLength(0);
  });
});
