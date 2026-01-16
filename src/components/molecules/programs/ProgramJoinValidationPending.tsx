import React from 'react';

import Button from 'components/atoms/ui/Button';
import useJoinProgramPendingValidation from 'hooks/programs/useJoinProgramPendingValidation';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { HTML_TAGS } from 'constants/general';

import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';

/**
 * Component that renders program newsletter options
 * @param programDetails
 * @param onNext
 * @constructor
 */
const ProgramJoinValidationPending = ({ programDetails, onNext }) => {
  const { displayFlex, flexAlignItemsCenter, mt2 } = coreStyle;
  const isPending = useJoinProgramPendingValidation(programDetails, onNext);

  if (!isPending) {
    return null;
  }

  return (
    <div className={`${displayFlex} ${flexAlignItemsCenter} ${mt2} ${coreStyle['flex-direction-column']}`}>
      <DynamicFormattedMessage id="program.join.pending.adminAgreements" tag={HTML_TAGS.P} />
      <DynamicFormattedMessage id="program.join.pending.notification" tag={HTML_TAGS.P} />
      <DynamicFormattedMessage id="program.join.pending.cta" tag={Button} onClick={onNext} className={mt2} />
    </div>
  );
};

export default ProgramJoinValidationPending;
