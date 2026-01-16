import React from 'react';
import NavigationPrompt from 'react-router-navigation-prompt';

import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import ProgramJoinUserDataFormAdditional from 'components/molecules/forms/ProgramJoinUserDataFormAdditional';
import GenericFormBuilder from 'components/organisms/form-wrappers/GenericFormBuilder';
import LeaveJourneyModal from 'components/organisms/modals/LeaveJourneyModal';
import { HTML_TAGS } from 'constants/general';
import { LOGIN, WALL_PROGRAM_JOIN_ROUTE } from 'constants/routes';
import useJoinProgramPersonalData from 'hooks/programs/useJoinProgramPersonalData';

import styles from 'assets/style/components/PersonalInformation/PersonalInformation.module.scss';
import settingsStyle from 'sass-boilerplate/stylesheets/components/wall/PersonalnformationSettings.module.scss';
import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';

/**
 * Component used to display user personal data form on program join
 * @param programDetails
 * @param onNext
 * @constructor
 */
const ProgramJoinUserDataFormWrapper = ({ programDetails, onNext }) => {
  const { formFields, setFormDataChanged, moveToNextStep } = useJoinProgramPersonalData(programDetails, onNext);

  return (
    <div className={`${styles.wrapperCenter} ${settingsStyle.settingPersonalInformations}`}>
      <NavigationPrompt
        when={(currentLocation, nextLocation) =>
          !(nextLocation.pathname.startsWith(WALL_PROGRAM_JOIN_ROUTE) || nextLocation.pathname.includes(LOGIN))
        }
      >
        {({ onConfirm, onCancel }) => (
          <LeaveJourneyModal visible={true} onCancel={onCancel} onConfirm={onConfirm} titleId="modal.join.exit.title" />
        )}
      </NavigationPrompt>
      <DynamicFormattedMessage id="program.join.personalData.required" tag={HTML_TAGS.DIV} />
      <GenericFormBuilder
        formClassName={coreStyle.mt2}
        formAction={moveToNextStep}
        formDeclaration={formFields}
        formSlot={form => <ProgramJoinUserDataFormAdditional form={form} setFormDataChanged={setFormDataChanged} />}
      />
    </div>
  );
};

export default ProgramJoinUserDataFormWrapper;
