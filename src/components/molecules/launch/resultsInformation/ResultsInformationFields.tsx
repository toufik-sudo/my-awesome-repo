import React from 'react';
import { FormattedMessage } from 'react-intl';

import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';

import style from 'assets/style/components/wall/GeneralWallStructure.module.scss';

/**
 * Template component used to render Results page
 *
 * @constructor
 */
const ResultsInformationFields = () => {
  return (
    <div className={style.contentWrapper}>
      <DynamicFormattedMessage tag="p" id="launchProgram.users.extraInformation" />
      <p>
        <FormattedMessage id="launchProgram.users.mandatoryItems" />
        <DynamicFormattedMessage tag="span" className="bold accent" id="launchProgram.users.mandatory" />
        <FormattedMessage id="launchProgram.users.askTooMuch" />
      </p>
    </div>
  );
};

export default ResultsInformationFields;
