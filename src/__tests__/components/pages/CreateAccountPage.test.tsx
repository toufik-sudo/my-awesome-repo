import NotFoundPage from 'components/pages/NotFoundPage';
import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import CreateAccountPage from 'components/pages/CreateAccountPage';
import { Provider } from 'react-redux';
import store from 'store';
import { BrowserRouter } from 'react-router-dom';

describe('CreateAccountPage', () => {
  const wrapper: ShallowWrapper<{}> = shallow(
    <Provider store={store}>
      <BrowserRouter>
        <CreateAccountPage />
      </BrowserRouter>
    </Provider>
  );

  test('renders without crashing', () => {
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.children().length).toBe(1);
  });
});
