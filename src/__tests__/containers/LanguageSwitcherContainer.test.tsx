import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import LanguageSwitcherContainer from 'containers/LanguageSwitcherContainer';
import LanguageSwitcher from 'components/atoms/ui/LanguageSwitcher';
import { Provider } from 'react-redux';
import store from 'store';
import { renderHook, act } from '@testing-library/react-hooks';

describe('App', () => {
  const wrapper: ShallowWrapper<{}> = shallow(
    <Provider store={store}>
      <LanguageSwitcherContainer>{props => <LanguageSwitcher {...props} />}</LanguageSwitcherContainer>
    </Provider>
  );

  test('renders without crashing', () => {
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.children().length).toBe(1);
  });
});
