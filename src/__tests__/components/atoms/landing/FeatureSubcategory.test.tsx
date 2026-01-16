import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';

import FeatureSubcategory from 'components/atoms/landing/FeatureSubcategory';

describe('Feature Subcategory', () => {
  const wrapper: ShallowWrapper<{}> = shallow(<FeatureSubcategory index={1} titleId="" iconBlock="" />);

  test('renders without crashing', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
