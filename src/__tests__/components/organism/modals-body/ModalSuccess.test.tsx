import SuccessModalBody from 'components/organisms/modals-body/SuccessModalBody';
import { shallow, ShallowWrapper } from 'enzyme';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';

describe('SuccessModalBody', () => {
  test('renders without crashing', () => {
    const wrapper: ShallowWrapper<{}> = shallow(
      <BrowserRouter>
        <SuccessModalBody onClick={jest.fn()} closeButtonHidden={true} data={{ type: 'reset' }} />
      </BrowserRouter>
    );
    expect(wrapper).toMatchSnapshot();
  });

  test('displays the close button', () => {
    const wrapper: ShallowWrapper<{}> = shallow(
      <BrowserRouter>
        <SuccessModalBody onClick={jest.fn()} closeButtonHidden={false} data={{ type: 'reset' }} />
      </BrowserRouter>
    );
    expect(wrapper.children().length).toBe(1);
  });

  test('hides the close button', () => {
    const wrapper: ShallowWrapper<{}> = shallow(
      <BrowserRouter>
        <SuccessModalBody onClick={jest.fn()} closeButtonHidden={true} data={{ type: 'reset' }} />
      </BrowserRouter>
    );
    expect(wrapper.children().length).toBe(1);
  });
});
