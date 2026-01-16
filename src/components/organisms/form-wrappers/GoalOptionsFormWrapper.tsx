import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import ButtonSubmitForm from 'components/atoms/ui/ButtonSubmitForm';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import GenericFormBuilder from 'components/organisms/form-wrappers/GenericFormBuilder';
import { HTML_TAGS } from 'constants/general';
import { INITIAL_SIMPLE_ALLOCATION } from 'constants/wall/launch';
import { useMultiStep } from 'hooks/launch/useMultiStep';
import { useWallSelection } from 'hooks/wall/useWallSelection';
import { IStore } from 'interfaces/store/IStore';
import { launchProgramSimpleAllocationSubmit } from 'store/actions/formActions';
import { setStoreData } from 'store/actions/launchActions';
import { isGoalOptionsFormCompleted } from 'services/LaunchServices';

import buttonStyle from 'assets/style/common/Button.module.scss';
import generalStyle from 'assets/style/components/wall/GeneralWallStructure.module.scss';
import style from 'assets/style/components/wall/GeneralWallStructure.module.scss';
import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';

/**
 * Organism component used to render Goal Options form for revenue
 *
 * @constructor
 */
const GoalOptionsFormWrapper = ({ typeOfGoalOptions }) => {
  const launchData = useSelector((store: IStore) => store.launchReducer);
  const { selectedPlatform } = useWallSelection();
  const dispatch = useDispatch();
  const {
    stepSet: { setNextStep }
  } = useMultiStep();
  if (!launchData.simpleAllocation) {
    launchData.simpleAllocation = INITIAL_SIMPLE_ALLOCATION;
    dispatch(setStoreData({ ...launchData }));
  }
  if (!launchData.platform) {
    launchData.platform = selectedPlatform;
    dispatch(setStoreData({ ...launchData }));
  }
  const { simpleAllocation } = launchData;

  return (
    <div className={style.containerLarge}>
      <GenericFormBuilder
        formAction={values => launchProgramSimpleAllocationSubmit(values, setNextStep, dispatch, simpleAllocation)}
        formDeclaration={typeOfGoalOptions}
        formClassName={generalStyle.formLarge}
        formSlot={form => {
          return (
            <>
              {simpleAllocation.globalError && (
                <DynamicFormattedMessage
                  id={simpleAllocation.globalError}
                  tag={HTML_TAGS.P}
                  className={generalStyle.mandatoryText}
                />
              )}
              <DynamicFormattedMessage
                tag={HTML_TAGS.P}
                className={generalStyle.mandatoryText}
                id="form.label.mandatory"
              />
              <div className={coreStyle.btnCenter}>
                <ButtonSubmitForm
                  isSubmitting={!simpleAllocation.globalError && form.isSubmitting}
                  buttonText="form.submit.next"
                  className={isGoalOptionsFormCompleted(form) ? '' : buttonStyle.disabled}
                />
              </div>
            </>
          );
        }}
      />
    </div>
  );
};

export default GoalOptionsFormWrapper;
