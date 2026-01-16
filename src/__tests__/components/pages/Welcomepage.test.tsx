import IntermediaryPage from 'components/pages/IntermediaryPage';
import ConnectedIntlProvider from 'containers/ConnectedIntlProvider';
import { mount } from 'enzyme';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router';
import store from 'store';

describe('IntermediaryPage', () => {
  const wrapper = mount(
    <Provider store={store}>
      <ConnectedIntlProvider>
        <MemoryRouter>
          <IntermediaryPage />
        </MemoryRouter>
      </ConnectedIntlProvider>
    </Provider>
  );

  test('renders without crashing', () => {
    const button = wrapper.find('a');
    expect(button.length).toBe(0);

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.children().length).toBe(1);
  });
});
