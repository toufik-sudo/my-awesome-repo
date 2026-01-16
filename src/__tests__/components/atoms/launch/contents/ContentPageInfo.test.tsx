import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';

import ContentsPageInfo from 'components/atoms/launch/contents/ContentPageInfo';

describe('Contents editor page', () => {
  const wrapper: ShallowWrapper<{}> = shallow(<ContentsPageInfo />);

  test('renders without crashing', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
