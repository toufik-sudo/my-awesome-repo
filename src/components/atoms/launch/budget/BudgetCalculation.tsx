import React from 'react';

import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import wallStyle from 'assets/style/components/wall/GeneralWallStructure.module.scss';
import { formatNumberLocale } from '../../../../utils/general';

/**
 * Atom component used to render budget calculation
 *
 * @param budget
 * @param currentPoints
 * @constructor
 */
const BudgetCalculation = ({ programBudget, currentPoints }) => {
  const { budgetInformationSubTitle, budgetInformationValue } = wallStyle;

  return (
    <div>
      <DynamicFormattedMessage
        className={budgetInformationSubTitle}
        tag="p"
        id="launchProgram.budget.pointsConversion"
      />
      <DynamicFormattedMessage
        className={budgetInformationValue}
        tag="p"
        values={{
          budget: formatNumberLocale(programBudget),
          points: formatNumberLocale(programBudget * currentPoints)
        }}
        id="launchProgram.budget.display"
      />
    </div>
  );
};

export default BudgetCalculation;
