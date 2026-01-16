import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FormattedMessage } from 'react-intl';

import Button from 'components/atoms/ui/Button';
import { BUTTON_MAIN_TYPE } from 'constants/ui';
import { emptyFn } from 'utils/general';
import { PRODUCTS_CTA_TYPE } from 'constants/wall/launch';

/**
 * Atom component used to render create new product submit button
 *
 * @param isProductDataValid
 * @param onClick
 * @param submitting
 * @constructor
 */
const CreateProductCTA = ({ isValid, onClick, submitting, title = PRODUCTS_CTA_TYPE.CREATE }) => {
  const { PRIMARY, DISABLED } = BUTTON_MAIN_TYPE;
  let buttonOutput = <FormattedMessage id={`launchProgram.products.${title}`} />;

  if (submitting) {
    buttonOutput = <FontAwesomeIcon icon={faSpinner} spin />;
  }

  return (
    <Button type={isValid ? PRIMARY : DISABLED} onClick={isValid ? onClick : emptyFn}>
      {buttonOutput}
    </Button>
  );
};

export default CreateProductCTA;
