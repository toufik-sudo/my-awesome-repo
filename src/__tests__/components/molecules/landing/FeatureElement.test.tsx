import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';

import FeatureBoxContent from 'components/molecules/landing/FeatureBoxContent';

describe('FeatureBoxContent', () => {
  test('renders without crashing and has the correct children and class', () => {
    const wrapper: ShallowWrapper<{}> = shallow(
      <FeatureBoxContent textId={''} titleId={''} boxIndex={0} position={0} setActiveBox={jest.fn()} />
    );

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.children()).toHaveLength(2);
    expect(wrapper.hasClass('active'));
  });

  test('renders the correct className when the index does not match the boxIndex', () => {
    const setActiveBoxMock = jest.fn();
    const wrapper: ShallowWrapper<{}> = shallow(
      <FeatureBoxContent textId={''} titleId={''} boxIndex={1} position={0} setActiveBox={setActiveBoxMock} />
    );

    wrapper.simulate('click');
    expect(setActiveBoxMock).toHaveBeenCalled();
    expect(wrapper.hasClass(''));
  });
});
