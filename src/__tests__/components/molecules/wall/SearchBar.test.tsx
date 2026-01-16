import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { Provider } from 'react-redux';

import IntlProvider from 'containers/ConnectedIntlProvider';
import SearchBar from 'components/molecules/wall/SearchBar';
import store from 'store';

describe('SearchBar', () => {
  const wrapper: ShallowWrapper<{}> = shallow(
    <Provider store={store}>
      <IntlProvider>
        <SearchBar />
      </IntlProvider>
    </Provider>
  );

  test('renders without crashing', () => {
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.children()).toHaveLength(1);
  });
});
