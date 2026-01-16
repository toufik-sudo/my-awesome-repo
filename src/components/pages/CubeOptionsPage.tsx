import React from 'react';
import { useSelector } from 'react-redux';

import Button from 'components/atoms/ui/Button';
import FrequencyAllocation from 'components/organisms/launch/cube/FrequencyAllocation';
import SpendType from 'components/organisms/launch/cube/SpendType';
import ValidityPoints from 'components/organisms/launch/cube/ValidityPoints';
import RewardedManagers from 'components/organisms/launch/cube/RewardedManagers';
import { useMultiStep } from 'hooks/launch/useMultiStep';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { IStore } from 'interfaces/store/IStore';

import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';
import StarAppreciation from 'components/organisms/launch/cube/StarAppreciation';

/**
 * Page component used to render full page cube
 *
 * @constructor
 */
const CubeOptionsPage = () => {
  const {
    stepSet: { setNextStep }
  } = useMultiStep();

  const {
    cube: {
      cubeValidated: { rewardPeopleManagers: rewardsPeopleManagersValidated }
    }
  } = useSelector((store: IStore) => store.launchReducer);

  return (
    <div>
      <FrequencyAllocation />
      <SpendType />
      <ValidityPoints />
      <RewardedManagers />
      <StarAppreciation/>
      {rewardsPeopleManagersValidated && (
        <div className={coreStyle.btnCenter}>
          <DynamicFormattedMessage
            {...{
              onClick: () => setNextStep(),
              tag: Button,
              id: 'form.submit.next'
            }}
          />
        </div>
      )}
    </div>
  );
};

export default CubeOptionsPage;
