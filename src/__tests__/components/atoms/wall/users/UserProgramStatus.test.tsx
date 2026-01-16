import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';

import UserProgramStatus from 'components/atoms/wall/users/UserProgramStatus';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { USER_PROGRAM_STATUS } from 'constants/api/userPrograms';

describe('UserProgramStatus', () => {
  test('renders a single user status on program selection', () => {
    const wrapper: ShallowWrapper<{}> = shallow(
      <UserProgramStatus status={USER_PROGRAM_STATUS.ACTIVE} onProgramOnly={true} userId="test123" style={{}} />
    );

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(DynamicFormattedMessage)).toHaveLength(1);
  });

  test('renders 3 user status counts on all programs selection', () => {
    const wrapper: ShallowWrapper<{}> = shallow(
      <UserProgramStatus
        status={{ [USER_PROGRAM_STATUS.ACTIVE]: 1 }}
        onProgramOnly={false}
        userId="test123"
        style={{}}
      />
    );

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.children()).toHaveLength(4);
  });
});
