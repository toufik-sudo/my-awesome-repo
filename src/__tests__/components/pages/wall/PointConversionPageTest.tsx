import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import PointConversionPage from 'components/pages/wall/PointConversionPage';
import { Provider } from 'react-redux';
import store from 'store';
import { BrowserRouter } from 'react-router-dom';

describe('PointConversionPage', () => {
  const wrapper: ShallowWrapper<{}> = shallow(
    <Provider store={store}>
      <BrowserRouter>
        <PointConversionPage />
      </BrowserRouter>
    </Provider>
  );

  test('renders without crashing', () => {
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.children().length).toBe(1);
  });
});
