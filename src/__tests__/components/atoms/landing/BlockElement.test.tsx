import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';

import BlockElement from 'components/atoms/landing/BlockElement';

describe('Block Element', () => {
  const wrapper: ShallowWrapper<{}> = shallow(
    <BlockElement additionalTitleClass={''} additionalContentClass={''} textId={''} titleId={''} />
  );

  test('renders without crashing', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
