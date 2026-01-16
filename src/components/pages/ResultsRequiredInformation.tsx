import React from 'react';

import UserFieldRow from 'components/molecules/launch/userInviteInfo/UserFieldRow';
import LaunchProgramTitle from 'components/molecules/launch/LaunchProgramTitle';
import Button from 'components/atoms/ui/Button';
import ResultsInformationFields from 'components/molecules/launch/resultsInformation/ResultsInformationFields';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { useFormFields } from 'hooks/launch/useFormFields';
import { GET_FORM_FIELDS_API_RESULTS_TYPE } from 'constants/api';
import { useResultsInformation } from 'hooks/launch/resultsInformation/useResultsInformation';
import { RESULTS_USERS_FIELDS } from 'constants/wall/launch';

import style from 'assets/style/components/wall/GeneralWallStructure.module.scss';
import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';
import SpringAnimation from 'components/molecules/animations/SpringAnimation';
import { setTranslate } from 'utils/animations';
import { DELAY_MULTIPLIER } from 'constants/animations';

/**
 * Template component used to render Results page
 *
 * @constructor
 */
const ResultsRequiredInformation = () => {
  const { formData, selectedFields, setSelectedFields } = useFormFields(
    GET_FORM_FIELDS_API_RESULTS_TYPE,
    RESULTS_USERS_FIELDS
  );
  const { submitResultsInformationFieldList } = useResultsInformation(selectedFields);

  return (
    <div>
      <LaunchProgramTitle
        titleId="launchProgram.title"
        subtitleId="launchProgram.resultInformation.subtitle"
        subtitleCustomClass={coreStyle.withSecondaryColor}
      />
      <div className={style.section}>
        <ResultsInformationFields />
        <UserFieldRow {...{ selectedFields, setSelectedFields, formData }} />
        {!!selectedFields.length && (
          <SpringAnimation settings={setTranslate(DELAY_MULTIPLIER)} className={coreStyle.btnCenter}>
            <DynamicFormattedMessage
              {...{
                tag: Button,
                onClick: submitResultsInformationFieldList,
                id: 'form.submit.next'
              }}
            />
          </SpringAnimation>
        )}
      </div>
    </div>
  );
};

export default ResultsRequiredInformation;
