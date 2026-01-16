import React, { memo } from 'react';
import { useHistory } from 'react-router';

import Button from 'components/atoms/ui/Button';
import { BUTTON_MAIN_VARIANT } from 'constants/ui';
import { PRICING, ROOT } from 'constants/routes';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';

import style from 'assets/style/components/ContactSection.module.scss';

/**
 * Molecule component used to render contact form additional
 *
 * @constructor
 */
const ContactFormAdditional = () => {
  const history = useHistory();

  return (
    <div className={style.buttonWrapper}>
      <DynamicFormattedMessage
        tag={Button}
        variant={BUTTON_MAIN_VARIANT.INVERTED}
        onClick={() =>
          history.push({
            pathname: `${ROOT}`,
            state: { forcedActiveSection: PRICING }
          })
        }
        id="modal.success.button"
      />
    </div>
  );
};

export default memo(ContactFormAdditional);
