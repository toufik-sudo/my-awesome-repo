import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';

import ProvidersWrapper from 'components/stories/utility/ProvidersWrapper';
import SocialNetworkInput from 'components/molecules/launch/contents/socialNetworkInput';
import { SOCIAL, SOCIAL_NETWORK_TYPES } from 'constants/wall/launch';

describe('Navigation', () => {
  const wrapper: ShallowWrapper<{}> = shallow(
    <ProvidersWrapper>
      <SocialNetworkInput
        index={SOCIAL.FACEBOOK}
        socialNetwork={SOCIAL_NETWORK_TYPES[SOCIAL.FACEBOOK]}
        setNetwork={jest.fn()}
      />
    </ProvidersWrapper>
  );

  test('renders without crashing', () => {
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.children()).toHaveLength(1);
  });
});
