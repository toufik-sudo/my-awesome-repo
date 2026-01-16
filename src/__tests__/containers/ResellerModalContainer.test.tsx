import ResellerModal from 'components/organisms/modals/ResellerModal';
import ResellerModalContainer from 'containers/ResellerModalContainer';
import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { Provider } from 'react-redux';
import store from 'store';

describe('ResellerModalContainer', () => {
  const wrapper: ShallowWrapper<{}> = shallow(
    <Provider store={store}>
      <ResellerModalContainer>{props => <ResellerModal {...props} />}</ResellerModalContainer>
    </Provider>
  );

  test('renders without crashing', () => {
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.children().length).toBe(1);
  });
});
