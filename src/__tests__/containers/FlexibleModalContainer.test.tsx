import ConnectedIntlProvider from 'containers/ConnectedIntlProvider';
import FlexibleModalContainer from 'containers/FlexibleModalContainer';
import { mount, ReactWrapper } from 'enzyme';
import React, { ReactElement } from 'react';
import { Provider } from 'react-redux';
import store from 'store';

describe('FlexibleModalContainer', () => {
  const element: ReactElement = (
    <Provider store={store}>
      <ConnectedIntlProvider>
        <FlexibleModalContainer
          isModalOpen
          closeModal={jest.fn()}
          className={''}
          closeButtonAvailable
          children={<div />}
        />
      </ConnectedIntlProvider>
    </Provider>
  );

  const wrapper: ReactWrapper = mount(element);
  test('renders without crashing', () => {
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.children().length).toBe(1);
  });
});
