import React from 'react';

import BudgetInputAndLabel from 'components/molecules/launch/program/BudgetInputAndLabel';
import BudgetInformationBox from 'components/molecules/launch/program/BudgetInformationBox';
import { useBudgetSet } from 'hooks/launch/program/useBudgetSet';

import wallStyle from 'assets/style/components/wall/GeneralWallStructure.module.scss';

/**
 * Organism component used to render budget information
 *
 * @constructor
 */
const BudgetInformation = () => {
  const { setBudgetValue, formattedBudget, programBudget } = useBudgetSet();

  return (
    <div className={wallStyle.budgetInformation}>
      <BudgetInputAndLabel {...{ setBudgetValue, formattedBudget }} />
      <BudgetInformationBox {...{ programBudget }} />
    </div>
  );
};

export default BudgetInformation;
