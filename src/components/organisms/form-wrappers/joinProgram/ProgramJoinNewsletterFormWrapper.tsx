import React from 'react';
import NavigationPrompt from 'react-router-navigation-prompt';

import ButtonFormatted from 'components/atoms/ui/ButtonFormatted';
import ProgramNewsletterOptions from 'components/molecules/programs/ProgramNewsletterOptions';
import ProgramAcceptTerms from 'components/molecules/programs/ProgramAcceptTerms';
import LeaveJourneyModal from 'components/organisms/modals/LeaveJourneyModal';
import { LOGIN, WALL_PROGRAM_JOIN_ROUTE } from 'constants/routes';
import { BUTTON_MAIN_TYPE } from 'constants/ui';
import useJoinProgram from 'hooks/programs/useJoinProgram';
import { emptyFn } from 'utils/general';

import styles from 'assets/style/components/PersonalInformation/PersonalInformation.module.scss';
import settingsStyle from 'sass-boilerplate/stylesheets/components/wall/PersonalnformationSettings.module.scss';
import buttonStyle from 'assets/style/common/Button.module.scss';
import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';

/**
 * Component used to display program join : newsletter / terms&conditions step
 * @param programDetails
 * @param onNext
 * @constructor
 */
const ProgramJoinNewsletterFormWrapper = ({ programDetails, onNext }) => {
  const { newsletter, setNewsletter, termsAccepted, setTermsAccepted, join, submitting } = useJoinProgram(
    programDetails.programId,
    onNext
  );
  const { termsAndConditionsUrl } = programDetails;

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
      <ProgramNewsletterOptions {...{ newsletter, setNewsletter }} />
      <ProgramAcceptTerms {...{ termsAccepted, setTermsAccepted, termsAndConditionsUrl }} />
      <div className={`${coreStyle.btnCenter} ${coreStyle.mt2}`}>
        <ButtonFormatted
          buttonText="program.join.cta"
          type={BUTTON_MAIN_TYPE.PRIMARY}
          isLoading={submitting}
          className={termsAccepted ? buttonStyle.primary : buttonStyle.disabled}
          onClick={termsAccepted ? join : emptyFn}
        />
      </div>
    </div>
  );
};

export default ProgramJoinNewsletterFormWrapper;
