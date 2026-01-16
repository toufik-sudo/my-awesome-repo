import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import GenericFormBuilder from './GenericFormBuilder';
import ButtonSubmitForm from 'components/atoms/ui/ButtonSubmitForm';
// import BudgetInformation from 'components/organisms/launch/program/BudgetInformation';
import { useMultiStep } from 'hooks/launch/useMultiStep';
import { launchProgramParametersAction } from 'store/actions/formActions';
import { useGeneratedUrl } from 'hooks/launch/useGeneratedUrl';
// import { isMobile } from 'utils/general';
import { buildUrlField, redirectToFirstStep, validateSubmitFormButton } from 'services/LaunchServices';
import { IStore } from 'interfaces/store/IStore';
import { FREEMIUM, GLOBAL_ERROR, PROGRAM_IDENTIFIER } from 'constants/wall/launch';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { HTML_TAGS } from 'constants/general';
import { setLaunchDataStep } from 'store/actions/launchActions';
import { WALL_PROGRAM_ROUTE } from 'constants/routes';
import style from 'assets/style/components/wall/GeneralWallStructure.module.scss';
import buttonStyle from 'assets/style/common/Button.module.scss';
import errorStyle from 'assets/style/common/Input.module.scss';

/**
 * Organism component used to render Personalise Program form
 *
 * @constructor
 */
const PersonaliseProgramFormWrapper = () => {
  const dispatch = useDispatch();
  const launchStore = useSelector((store: IStore) => store.launchReducer);
  const {
    extendUrl,
    programName,
    type,
    confidentiality,
    duration,
    isFreePlan,
    // programJourney,
    globalError
  } = launchStore;

  const generatedUrl = useGeneratedUrl(isFreePlan);
  // const isJourneyFull = programJourney === FULL;
  const {
    containerSmall,
    accentLabels,
    personaliseProgramWrapper,
    personaliseProgramForm,
    buttonMargin,
    alignCenterOnDesktop,
    submitButtonContainer
  } = style;
  const isFreemium = type === FREEMIUM;
  const {
    stepSet: { setNextStep }
  } = useMultiStep();

  useEffect(() => {
    dispatch(setLaunchDataStep({ key: GLOBAL_ERROR, value: '' }));
  }, [duration]);
  if (!confidentiality || !type) redirectToFirstStep();
  if (!generatedUrl) return null;

  const baseProgramUrl = `${window.location.origin}${WALL_PROGRAM_ROUTE}/${type}/${PROGRAM_IDENTIFIER}/`;
  const formFields = buildUrlField(
    generatedUrl.customUrl,
    { extendUrl, programName },
    duration,
    baseProgramUrl,
    isFreePlan,
    isFreemium
  );

  return (
    <div className={`${containerSmall} ${accentLabels} ${personaliseProgramWrapper}`}>
      <GenericFormBuilder
        formAction={values => launchProgramParametersAction(values, setNextStep, dispatch, type)}
        formDeclaration={formFields}
        validateOnMount
        formClassName={personaliseProgramForm}
        formSlot={form => (
          <>
            {globalError && (
              <DynamicFormattedMessage
                id={launchStore.globalError}
                tag={HTML_TAGS.P}
                className={errorStyle.errorRelative}
              />
            )}
            {/*{!isFreemium && isJourneyFull && isMobile() && <BudgetInformation />}*/}
            <div className={`${alignCenterOnDesktop} ${submitButtonContainer}`}>
              <ButtonSubmitForm
                {...{
                  isSubmitting: form.isSubmitting,
                  buttonText: 'form.submit.next',
                  className: `${buttonMargin} ${validateSubmitFormButton(form, isFreePlan) ? buttonStyle.disabled : ''}`
                }}
              />
            </div>
          </>
        )}
      />
      {/*{!isFreemium && isJourneyFull && !isMobile() && <BudgetInformation />}*/}
    </div>
  );
};

export default PersonaliseProgramFormWrapper;
