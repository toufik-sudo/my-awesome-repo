import React from 'react';

import style from 'assets/style/components/launch/Launch.module.scss';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { HTML_TAGS } from 'constants/general';

/**
 * Molecule component used to display error list
 *
 * @param invalidRecords
 * @constructor
 */
const GenericLaunchErrorMessageField = ({ error }) => {
  if (!error || !error.message) {
    return <p></p>;
  }

  return (
    <DynamicFormattedMessage tag={HTML_TAGS.P} className={style.error} id="launchProgram.finalStep.genericError" />
  );
};

export default GenericLaunchErrorMessageField;
