import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';

import UserProgramRole from 'components/atoms/wall/users/UserProgramRole';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { ROLE } from 'constants/security/access';

describe('UserProgramRole', () => {
  test('renders a single user role on program selection', () => {
    const user = { role: ROLE.BENEFICIARY, isPeopleManager: false };

    const wrapper: ShallowWrapper<{}> = shallow(<UserProgramRole user={user} onProgramOnly={true} style={{}} />);

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(DynamicFormattedMessage)).toHaveLength(1);
  });

  test('renders user and manager role count on all programs selection', () => {
    const userRoles = { [ROLE.BENEFICIARY]: 2 };
    const user = { role: userRoles, peopleManager: 1 };

    const wrapper: ShallowWrapper<{}> = shallow(<UserProgramRole user={user} onProgramOnly={false} style={{}} />);

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.children()).toHaveLength(2);
  });
});
