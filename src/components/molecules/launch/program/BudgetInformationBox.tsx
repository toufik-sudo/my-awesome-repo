import React from 'react';

import BudgetCalculation from 'components/atoms/launch/budget/BudgetCalculation';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import wallStyle from 'assets/style/components/wall/GeneralWallStructure.module.scss';
import { BUDGET_POINTS_VALUE } from 'constants/wall/launch';

/**
 * Molecule component used to render budget information block
 *
 * @param budget
 * @param currentPoints
 * @constructor
 */
const BudgetInformationBox = ({ programBudget }) => {
  const { budgetInformationOptional, budgetInformationTitle, budgetInformationValue, budgetInformationBox } = wallStyle;
  const currentPoints = BUDGET_POINTS_VALUE;

  return (
    <div className={budgetInformationBox}>
      <DynamicFormattedMessage className={budgetInformationTitle} tag="p" id="launchProgram.budget.informationTitle" />
      {programBudget ? (
        <BudgetCalculation {...{ programBudget, currentPoints }} />
      ) : (
        <DynamicFormattedMessage className={budgetInformationValue} tag="p" id="launchProgram.budget.noBudget" />
      )}
      <DynamicFormattedMessage
        className={budgetInformationOptional}
        tag="p"
        values={{ points: currentPoints }}
        id="launchProgram.budget.euroConversionInfo"
      />
    </div>
  );
};

export default BudgetInformationBox;
