import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import ConnectedIntlProvider from '../../../containers/ConnectedIntlProvider';
import NotFoundPage from 'components/pages/NotFoundPage';
import store from '../../../store';
import { shallow, ShallowWrapper } from 'enzyme';

describe('NotFoundPage', () => {
  const wrapper: ShallowWrapper<{}> = shallow(
    <Provider store={store}>
      <ConnectedIntlProvider>
        <BrowserRouter>
          <NotFoundPage />
        </BrowserRouter>
      </ConnectedIntlProvider>
    </Provider>
  );

  test('renders without crashing', () => {
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.children().length).toBe(1);
  });
});
