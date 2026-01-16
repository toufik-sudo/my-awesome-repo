import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';

import BudgetCalculation from 'components/atoms/launch/budget/BudgetCalculation';

describe('Budget Calculation', () => {
  const wrapper: ShallowWrapper<{}> = shallow(<BudgetCalculation programBudget={10000} currentPoints={2500} />);

  test('renders without crashing', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
