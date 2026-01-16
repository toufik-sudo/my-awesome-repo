import CTAFormBlock from 'components/molecules/landing/CTAFormBlock';
import { shallow, ShallowWrapper } from 'enzyme';
import React from 'react';

describe('LandingCtaFormBlock', () => {
  const wrapper: ShallowWrapper<{}> = shallow(
    <CTAFormBlock
      title="form.cta.tailored.title"
      onClick={jest.fn}
      body="form.cta.tailored.body"
      buttonDouble
      buttonText="form.cta.tailored.button"
    />
  );

  test('renders without crashing', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
