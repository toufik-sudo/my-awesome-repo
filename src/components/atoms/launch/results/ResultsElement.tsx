import React from 'react';

import { CheckboxButton } from 'components/molecules/forms/fields/CheckboxButton';

import style from 'assets/style/common/Checkbox.module.scss';

/**
 * Atom component used to render Results Element
 *
 * @constructor
 */
const ResultsElement = ({ label, index, resultChannel }) => {
  return (
    <div className={style.checkboxContainer}>
      <CheckboxButton {...{ label, index, resultChannel }} />
    </div>
  );
};

export default ResultsElement;
