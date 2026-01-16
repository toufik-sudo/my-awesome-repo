import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';

import SocialNetworkList from 'components/organisms/launch/contents/SocialNetworkList';
import { SOCIAL_NETWORK_TYPES } from 'constants/wall/launch';

describe('Social Network List', () => {
  const wrapper: ShallowWrapper<{}> = shallow(
    <SocialNetworkList setNetwork={jest.fn()} socialNetworks={SOCIAL_NETWORK_TYPES} />
  );

  test('renders without crashing', () => {
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.children().length).toBe(5);
  });
});
