import { ValidationMessage } from 'components/molecules/forms/fields/ValidationMessage';
import { shallow, ShallowWrapper } from 'enzyme';
import React from 'react';

describe('ValidationMessage', () => {
  test('renders without crashing', () => {
    const wrapper: ShallowWrapper<{}> = shallow(<ValidationMessage errors={[]} label={''} touched={[]} />);

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.children().length).toBe(0);
  });

  test('when errors are matching the label, should output error', () => {
    const wrapper: ShallowWrapper<{}> = shallow(
      <ValidationMessage errors={{ lastName: 'required' }} label={'lastName'} touched={{ lastName: 'required' }} />
    );
    expect(wrapper.children().length).toBe(0);
  });
});
