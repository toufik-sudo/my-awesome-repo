import GenericFormBuilder from 'components/organisms/form-wrappers/GenericFormBuilder';
import ConnectedIntlProvider from 'containers/ConnectedIntlProvider';
import { shallow, ShallowWrapper } from 'enzyme';
import React from 'react';
import { Provider } from 'react-redux';
import store from 'store';

describe('GenericFormBuilder', () => {
  const wrapper: ShallowWrapper<{}> = shallow(
    <Provider store={store}>
      <ConnectedIntlProvider>
        <GenericFormBuilder
          upperSlot={<div />}
          formAction={jest.fn()}
          outsideSlot={<div />}
          formSlot={() => <div />}
          formDeclaration={[]}
        />
      </ConnectedIntlProvider>
    </Provider>
  );

  test('renders without crashing', () => {
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.children().length).toBe(1);
  });
});
