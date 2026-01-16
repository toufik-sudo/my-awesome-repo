import React from 'react';
import { useParams } from 'react-router';
import { useSelector } from 'react-redux';
import { IStore } from 'interfaces/store/IStore';

import PageIndexItem from 'components/atoms/ui/PageIndexItem';
import { EXCLUDED_INTERMEDIARY_STEPS, LAUNCH_STEP_TYPES } from 'constants/wall/launch';
import { PROGRAM_CONFIDENTIALITY_OPEN, USERS } from 'constants/wall/launch';
import style from 'assets/style/components/wall/PageIndex.module.scss';

/**
 * Organism component used to render page index functionality
 *
 * @constructor
 */
const PageIndexList = () => {
  const { confidentiality, type } = useSelector((store: IStore) => store.launchReducer);
  const { wrapper, wrapperList } = style;
  const params: any = useParams();
  const { step, stepIndex } = params;

  if (!LAUNCH_STEP_TYPES[step]) return null;
  let launchSteps = LAUNCH_STEP_TYPES[step].steps;

  if (confidentiality === PROGRAM_CONFIDENTIALITY_OPEN && step === USERS) {
    launchSteps = launchSteps.filter((step, index) => index < launchSteps.length - 1);
  }

  if (LAUNCH_STEP_TYPES[step].hideIndex) return null;

  if (EXCLUDED_INTERMEDIARY_STEPS.includes(step) && parseInt(stepIndex) === 1) {
    return null;
  }

  if (!launchSteps || launchSteps.length === 1) {
    return null;
  }

  return (
    <div className={wrapper}>
      <ul className={wrapperList}>
        {launchSteps.map((step, index) => (
          <PageIndexItem key={index} index={step.index} type={type} />
        ))}
      </ul>
    </div>
  );
};

export default PageIndexList;
