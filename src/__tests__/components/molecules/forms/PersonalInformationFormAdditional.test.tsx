import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';

import PersonalInformationFormAdditional from 'components/molecules/forms/PersonalInformationFormAdditional';
import ProvidersWrapper from 'components/stories/utility/ProvidersWrapper';

describe('PersonalInformationFormAdditional', () => {
  const wrapper: ShallowWrapper<{}> = shallow(
    <ProvidersWrapper>
      <PersonalInformationFormAdditional form={{}} formLoading />
    </ProvidersWrapper>
  );

  test('renders without crashing', () => {
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.children()).toHaveLength(1);
  });
});
