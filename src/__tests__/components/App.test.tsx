import App from 'components/App';
import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { Provider } from 'react-redux';
import store from 'store';

describe('App', () => {
  const wrapper: ShallowWrapper<{}> = shallow(
    <Provider store={store}>
      <App />
    </Provider>
  );

  test('renders without crashing', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
