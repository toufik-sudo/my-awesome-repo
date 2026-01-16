import React from 'react';
import { useSelector } from 'react-redux';

import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { processOptionsText } from 'services/FormServices';
import { IStore } from 'interfaces/store/IStore';

import style from 'assets/style/components/wall/GeneralWallStructure.module.scss';

/**
 * Organism component that renders the tabs and panels for Goal Options
 *
 * @constructor
 */
const GoalOptionsAlert = ({ loyaltyText, challengeText, sponsorshipText }) => {
  const { type } = useSelector((store: IStore) => store.launchReducer);

  return (
    <DynamicFormattedMessage
      tag="p"
      className={style.alertText}
      id={processOptionsText(
        type,
        { loyaltyText, challengeText, sponsorshipText },
        'launchProgram.goalOptions.',
        '.info'
      )}
    />
  );
};

export default GoalOptionsAlert;
