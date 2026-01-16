import HomePage from 'components/pages/HomePage';
import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import store from 'store';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

describe('HomePage', () => {
  const wrapper: ShallowWrapper<{}> = shallow(
    <Provider store={store}>
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    </Provider>
  );

  test('renders without crashing', () => {
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.children().length).toBe(1);
  });
});
