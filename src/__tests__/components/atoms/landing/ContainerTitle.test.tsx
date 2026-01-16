import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';

import BlockElement from 'components/atoms/landing/BlockElement';
import ContainerTitle from 'components/atoms/landing/ContainerTitle';

describe('Container Title', () => {
  const wrapper: ShallowWrapper<{}> = shallow(<ContainerTitle textId="" />);

  test('renders without crashing', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
