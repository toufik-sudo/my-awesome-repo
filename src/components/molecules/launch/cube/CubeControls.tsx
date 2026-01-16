import React from 'react';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormattedMessage } from 'react-intl';

import Button from 'components/atoms/ui/Button';
import { useCubeControls } from 'hooks/launch/cube/useCubeControls';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { BUTTON_MAIN_TYPE } from 'constants/ui';
import { emptyFn } from 'utils/general';

import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';
import grid from 'sass-boilerplate/stylesheets/vendors/bootstrap-grid.module.scss';

/**
 * Molecule component used to render cube controls
 *
 * @param goal
 * @param index
 * @param setSelectedGoal
 * @constructor
 */
const CubeControls = ({ goal, index, setSelectedGoal }) => {
  const {
    handleCreateNewGoal,
    addGoalVisible,
    isLoading,
    setNextStep,
    isAllFormsValidated,
    notCorrelatedValid,
    correlatedValid
  } = useCubeControls(goal, index, setSelectedGoal);

  let addGoalOutput = <FormattedMessage id="launchProgram.cube.add.goal" />;

  if (isLoading) {
    addGoalOutput = <FontAwesomeIcon icon={faSpinner} spin />;
  }

  let validateButton = null;

  if (correlatedValid || notCorrelatedValid) {
    validateButton = (
      <DynamicFormattedMessage
        {...{
          className: grid['ml-5'],
          onClick: () => (!isLoading ? setNextStep() : emptyFn())
        }}
        id="launchProgram.cube.validate"
        tag={Button}
      />
    );
  }

  return (
    <div className={`${coreStyle.btnCenter} ${grid['mt-5']}`}>
      {addGoalVisible && (
        <Button onClick={isLoading ? emptyFn : handleCreateNewGoal} type={BUTTON_MAIN_TYPE.SECONDARY}>
          {addGoalOutput}
        </Button>
      )}
      {isAllFormsValidated && validateButton}
    </div>
  );
};

export default CubeControls;
