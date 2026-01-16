import ButtonFormatted from 'components/atoms/ui/ButtonFormatted';
import { shallow, ShallowWrapper } from 'enzyme';
import React from 'react';
import { emptyFn } from 'utils/general';

describe('ButtonFormatted', () => {
  const wrapper: ShallowWrapper<{}> = shallow(
    <ButtonFormatted buttonText="form.cta.tailored.button" onClick={emptyFn} />
  );

  test('renders without crashing', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
