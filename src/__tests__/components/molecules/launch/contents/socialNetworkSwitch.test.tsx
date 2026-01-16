import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';

import SocialNetworkSwitch from 'components/molecules/launch/contents/socialNetworkSwitch';
import { SOCIAL, SOCIAL_NETWORK_TYPES } from 'constants/wall/launch';

describe('Navigation', () => {
  const wrapper: ShallowWrapper<{}> = shallow(
    <SocialNetworkSwitch
      index={SOCIAL.FACEBOOK}
      socialNetwork={SOCIAL_NETWORK_TYPES[SOCIAL.FACEBOOK]}
      setNetwork={jest.fn()}
    />
  );

  test('renders without crashing', () => {
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.children()).toHaveLength(0);
  });
});
