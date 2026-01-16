import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';

import SocialNetworksPage from 'components/pages/SocialNetworksPage';
import ProvidersWrapper from 'components/stories/utility/ProvidersWrapper';

describe('Social network page', () => {
  const wrapper: ShallowWrapper<{}> = shallow(
    <ProvidersWrapper>
      <SocialNetworksPage />
    </ProvidersWrapper>
  );

  test('renders without crashing', () => {
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.children().length).toBe(1);
  });
});
