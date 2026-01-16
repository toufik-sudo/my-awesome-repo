import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';

import SocialNetworkBlock from 'components/organisms/launch/contents/SocialNetworkBlock';
import { SOCIAL, SOCIAL_NETWORK_TYPES } from 'constants/wall/launch';

describe('Social Network block', () => {
  const wrapper: ShallowWrapper<{}> = shallow(
    <SocialNetworkBlock
      message="launchProgram.contents.socialnetworks.label"
      index={SOCIAL.FACEBOOK}
      icon={jest.fn()}
      setNetwork={jest.fn()}
      socialNetwork={SOCIAL_NETWORK_TYPES[SOCIAL.FACEBOOK]}
    />
  );

  test('renders without crashing', () => {
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.children().length).toBe(2);
  });
});
