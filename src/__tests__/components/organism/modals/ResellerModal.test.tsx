import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';

import { mockIntl } from '__mocks__/intlMocks';
import ResellerModal from 'components/organisms/modals/ResellerModal';

describe('ResellerModal', () => {
  const wrapper: ShallowWrapper<{}> = shallow(
    <ResellerModal submitResellerForm={jest.fn()} intl={mockIntl()} closeResellerModal={jest.fn()} />
  );

  test('renders without crashing', () => {
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.children().length).toBe(1);
  });
});
