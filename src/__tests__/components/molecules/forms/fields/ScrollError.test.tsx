import RadioTextInputField from 'components/molecules/forms/fields/RadioTextInputField';
import { shallow, ShallowWrapper } from 'enzyme';
import React from 'react';
import { ErrorFocus } from 'components/molecules/forms/fields/ScrollError';

describe('RadioTextInputField', () => {
  const wrapper: ShallowWrapper<{}> = shallow(<ErrorFocus />);

  test('renders without crashing', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
