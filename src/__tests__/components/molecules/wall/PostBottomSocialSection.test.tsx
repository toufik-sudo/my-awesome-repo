import React from 'react';
import store from 'store';
import { Provider } from 'react-redux';
import { shallow, ShallowWrapper } from 'enzyme';

import PostBottomSocialSection from 'components/molecules/wall/PostBottomSocialSection';

describe('PostBottomSocialSection', () => {
  const wrapper: ShallowWrapper<{}> = shallow(
    <Provider store={store}>
      <PostBottomSocialSection />
    </Provider>
  );

  test('renders without crashing', () => {
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.children()).toHaveLength(1);
  });
});
