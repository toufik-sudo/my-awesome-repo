import React from 'react';

import styles from 'assets/style/components/CreateAccountLogin.module.scss';

/**
 * Atom component used to render error block for register response error
 * @param error
 * @constructor
 */
const RegisterResponseErrorBlock = ({ error }) => {
  return <label className={styles.registerFormError}>{error}</label>;
};

export default RegisterResponseErrorBlock;
