import React from 'react';
import { useIntl } from 'react-intl';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Button from 'components/atoms/ui/Button';
import { BUTTON_MAIN_TYPE } from 'constants/ui';

import postStyle from 'sass-boilerplate/stylesheets/components/wall/PostList.module.scss';

/**
 * Atom component used to render next step btn for design
 *
 * @param allDataValid
 * @param handleNextStep
 * @param isLoading
 * @param className
 * @constructor
 */
const CreatePostNextStep = ({ allDataValid, handleNextStep, isLoading, color }) => {
  const intl = useIntl();
  const isDisabled = !allDataValid || isLoading;

  return (
    <span>
      <Button
        type={isDisabled ? BUTTON_MAIN_TYPE.DISABLED : BUTTON_MAIN_TYPE.PRIMARY}
        onClick={handleNextStep}
        className={postStyle.postCTA}
        disabled={isDisabled}
        customStyle={{ background: !isDisabled && color }}
      >
        {isLoading ? <FontAwesomeIcon icon={faSpinner} spin /> : intl.formatMessage({ id: 'form.submit.publish' })}
      </Button>
    </span>
  );
};

export default CreatePostNextStep;
