import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';

import FeatureIconText from 'components/atoms/landing/FeatureIconText';

describe('Feature Icon Text', () => {
  const wrapper: ShallowWrapper<{}> = shallow(<FeatureIconText textId="" position="" />);

  test('renders without crashing', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
