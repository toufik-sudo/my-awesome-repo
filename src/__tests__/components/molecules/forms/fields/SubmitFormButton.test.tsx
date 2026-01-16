import React from 'react';
import { Provider } from 'react-redux';

import store from 'store';
import IntlProvider from 'containers/ConnectedIntlProvider';
import SubmitFormButton from 'components/atoms/ui/ButtonSubmitForm';
import { shallow, ShallowWrapper } from 'enzyme';

describe('SubmitFormButton', () => {
  const wrapper: ShallowWrapper<{}> = shallow(
    <Provider store={store}>
      <IntlProvider>
        <SubmitFormButton isSubmitting buttonText="" />
      </IntlProvider>
    </Provider>
  );

  test('renders without crashing', () => {
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.children().length).toBe(1);
  });
});
