import React from 'react';
import store from 'store';
import { Provider } from 'react-redux';
import { shallow, ShallowWrapper } from 'enzyme';

import AuthModalTemplate from 'components/templates/AuthModalTemplate';
import { LOGIN_MODAL } from 'constants/modal';

describe('AuthModalTemplate', () => {
  const wrapper: ShallowWrapper<{}> = shallow(
    <Provider store={store}>
      <AuthModalTemplate targetModal={LOGIN_MODAL}>{() => <div />}</AuthModalTemplate>
    </Provider>
  );

  test('renders without crashing', () => {
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.children().length).toBe(1);
  });
});
