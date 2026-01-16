import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { BrowserRouter } from 'react-router-dom';

import PersonalInformationFormAdditional from 'components/molecules/forms/PersonalInformationFormAdditional';
import FrequencyOfPaymentList from 'components/organisms/onboarding/FrequencyOfPaymentList';
import { FREQUENCY_PRICING_PLAN } from '__mocks__/pricingMocks';
import { INITIAL_SLIDE } from 'constants/landing';

describe('PersonalInformationFormAdditional', () => {
  test('renders without crashing and no child is render is pricing data is empty', () => {
    const wrapper: ShallowWrapper<{}> = shallow(
      <BrowserRouter>
        <FrequencyOfPaymentList initialSlide={INITIAL_SLIDE} pricingData={[]} />
      </BrowserRouter>
    );

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.children().children()).toHaveLength(0);
  });

  test('renders without crashing and the children is rendered accordingly', () => {
    const wrapper: ShallowWrapper<{}> = shallow(
      <BrowserRouter>
        <FrequencyOfPaymentList initialSlide={INITIAL_SLIDE} pricingData={[FREQUENCY_PRICING_PLAN]} />
      </BrowserRouter>
    );

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.children()).toHaveLength(1);
  });
});
