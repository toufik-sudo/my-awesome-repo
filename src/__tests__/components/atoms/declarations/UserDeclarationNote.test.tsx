import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';

import UserDeclarationNote from 'components/atoms/declarations/UserDeclarationNote';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

describe('UserDeclarationNote', () => {
  const props = {
    id: 123,
    text: 'test note',
    onDelete: jest.fn()
  };

  const wrapper: ShallowWrapper<{}> = shallow(<UserDeclarationNote {...props} />);

  test('renders without crashing', () => {
    expect(wrapper).toMatchSnapshot();
  });

  test('calls delete handler when delete icon clicked', () => {
    const deleteTrigger = wrapper.find(FontAwesomeIcon);

    expect(deleteTrigger).toHaveLength(1);

    deleteTrigger.simulate('click');
    expect(props.onDelete).toHaveBeenCalledWith(props.id);
  });
});
