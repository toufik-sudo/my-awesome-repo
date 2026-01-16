import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { BrowserRouter } from 'react-router-dom';

import DeleteAccountModal from 'components/organisms/modals/DeleteAccountModal';

describe('SuccessModalBody', () => {
  test('renders without crashing', () => {
    const wrapper: ShallowWrapper<{}> = shallow(
      <BrowserRouter>
        <DeleteAccountModal setShowModal={false} showModal={false} onDelete={jest.fn()} />
      </BrowserRouter>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
