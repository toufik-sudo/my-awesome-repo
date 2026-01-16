import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';

import UserInformationMandatoryFields from 'components/molecules/launch/userInviteInfo/UserInformationMandatoryFields';
import ProvidersWrapper from 'components/stories/utility/ProvidersWrapper';

describe('UserInformationMandatoryFields', () => {
  const wrapper: ShallowWrapper<{}> = shallow(
    <ProvidersWrapper>
      <UserInformationMandatoryFields />
    </ProvidersWrapper>
  );

  test('renders without crashing', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
