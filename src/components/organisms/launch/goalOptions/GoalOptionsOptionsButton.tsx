/* eslint-disable quotes */
import React from 'react';
import { useSelector } from 'react-redux';

import ButtonFormatted from 'components/atoms/ui/ButtonFormatted';
import { IStore } from 'interfaces/store/IStore';
import { BUTTON_MAIN_TYPE } from 'constants/ui';
import { processOptionsText } from 'services/FormServices';

/**
 * Organism component that renders the Option Button for Goal Options page
 *
 * @constructor
 */
const GoalOptionsOptionButton = ({ challengeText, loyaltyText }) => {
  const { type } = useSelector((store: IStore) => store.launchReducer);
  const isChallengeProgram = type === 'challenge';
  const isLoyaltyProgram = type === 'loyalty';

  return (
    <>
      {(isChallengeProgram || isLoyaltyProgram) && (
        <ButtonFormatted
          buttonText={processOptionsText(type, { challengeText, loyaltyText }, 'form.label.radio.')}
          type={BUTTON_MAIN_TYPE.TEXT_ONLY}
        />
      )}
    </>
  );
};

export default GoalOptionsOptionButton;
