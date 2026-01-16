import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { BrowserRouter } from 'react-router-dom';

import WallCreateAccountFormWrapper from 'components/organisms/form-wrappers/updateAccountInformation/WallCreateAccountFormWrapper';
import ProvidersWrapper from 'components/stories/utility/ProvidersWrapper';

describe('WallCreateAccountFormWrapper', () => {
  const wrapper: ShallowWrapper<{}> = shallow(
    <ProvidersWrapper>
      <BrowserRouter>
        <WallCreateAccountFormWrapper />
      </BrowserRouter>
    </ProvidersWrapper>
  );

  test('renders without crashing', () => {
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.children().length).toBe(1);
  });
});
