import { useDispatch, useSelector } from 'react-redux';
import { IStore } from 'interfaces/store/IStore';
import { CLOSED } from 'constants/general';
import { useMultiStep } from 'hooks/launch/useMultiStep';
import { setLaunchDataStep } from 'store/actions/launchActions';
import { ACCEPTED_EMAIL_INVITATIONS, INVITED_USERS_FIELDS } from 'constants/wall/launch';

/**
 * Hook used to handle user invite confirmation on user fields customistation
 *
 * @param selectedFields
 */
export const useUserInviteConfirmation = selectedFields => {
  const dispatch = useDispatch();
  const { confidentiality } = useSelector((store: IStore) => store.launchReducer);
  const isClosedProgram = confidentiality === CLOSED;
  const {
    stepSet: { setNextStep, setResultStep }
  } = useMultiStep();

  const dispatchActions = (accept: boolean) => {
    dispatch(setLaunchDataStep({ key: INVITED_USERS_FIELDS, value: selectedFields }));
    dispatch(setLaunchDataStep({ key: ACCEPTED_EMAIL_INVITATIONS, value: accept }));
  };

  const submitUserInviteFieldList = () => {
    dispatchActions(true);
    setNextStep();
  };

  const submitUserInviteListDecline = () => {
    dispatchActions(false);
    setResultStep(true);
  };

  return { isClosedProgram, submitUserInviteListDecline, submitUserInviteFieldList };
};
