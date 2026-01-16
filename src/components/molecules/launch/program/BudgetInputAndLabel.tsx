import React from 'react';

import { blockNumberInvalidCharacters } from 'services/FormServices';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';

import style from 'assets/style/common/Input.module.scss';
import wallStyle from 'assets/style/components/wall/GeneralWallStructure.module.scss';
import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';

/**
 * Molecule component used to render budget input and label
 *
 * @param budget
 * @param setBudgetValue
 * @param budgetValidation
 * @constructor
 */
const BudgetInputAndLabel = ({ formattedBudget, setBudgetValue }) => {
  const { container, budgetWrapper } = style;

  const { pb1 } = coreStyle;
  return (
    <>
      <div className={`${container} ${budgetWrapper}`}>
        <input
          className={style.defaultInputStyle}
          value={formattedBudget}
          type="text"
          onChange={setBudgetValue}
          onKeyDown={blockNumberInvalidCharacters}
        />
        <DynamicFormattedMessage tag="label" className="inputLabel" id="launchProgram.label.budget" />
      </div>
      <DynamicFormattedMessage
        className={`${wallStyle.budgetInformationOptional} ${pb1}`}
        tag="p"
        id="launchProgram.budget.optionalField"
      />
    </>
  );
};

export default BudgetInputAndLabel;
