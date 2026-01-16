import Nav from 'components/organisms/landing/Nav';
import { NAV_DARK, NAV_LIGHT } from 'constants/landing';
import { shallow, ShallowWrapper } from 'enzyme';
import React from 'react';
import { Provider } from 'react-redux';
import store from 'store';

describe('Nav', () => {
  test('navColor light is set to className', () => {
    const wrapper: ShallowWrapper<{}> = shallow(
      <Provider store={store}>
        <Nav openModal={jest.fn()} />
      </Provider>
    );

    expect(wrapper.hasClass('navDark')).toBeFalsy();
  });

  test('navColor dark is set to className', () => {
    const wrapper: ShallowWrapper<{}> = shallow(
      <Provider store={store}>
        <Nav openModal={jest.fn()} />
      </Provider>
    );

    expect(wrapper.hasClass('navLight')).toBeFalsy();
  });

  test('renders without crashing', () => {
    const wrapper: ShallowWrapper<{}> = shallow(
      <Provider store={store}>
        <Nav openModal={jest.fn()} />
      </Provider>
    );

    expect(wrapper).toMatchSnapshot();
  });
});
