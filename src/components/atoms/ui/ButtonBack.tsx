import React, { memo } from 'react';

import Button from 'components/atoms/ui/Button';
import { DynamicFormattedMessage } from './DynamicFormattedMessage';
import { BUTTON_MAIN_TYPE } from 'constants/ui';

import styles from 'assets/style/components/CreateAccountLogin.module.scss';

/**
 * Atom component used to render back button
 *
 * @param onClick
 * @constructor
 *
 * @see ButtonStory
 */
const ButtonBack = ({ onClick }) => (
  <DynamicFormattedMessage
    tag={Button}
    type={BUTTON_MAIN_TYPE.ALT}
    {...{ onClick }}
    className={styles.goBack}
    id="form.label.back"
  />
);

export default memo(ButtonBack);
