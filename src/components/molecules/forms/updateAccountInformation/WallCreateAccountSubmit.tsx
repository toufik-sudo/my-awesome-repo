import React, { useEffect } from 'react';

import SubmitFormButton from 'components/atoms/ui/ButtonSubmitForm';

import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';

/**
 * Molecule component used to submit update account form
 * @param form
 * @param imageError
 * @constructor
 */
const WallCreateAccountSubmit = ({ form, imageError = null }) => {
  let isLoading = false;

  useEffect(() => {
    const isAvatarError = imageError && imageError.requiredImage && imageError.requiredImage !== '';
    isLoading = !isAvatarError && form.isSubmitting;
  }, [imageError, form.isSubmitting]);

  return (
    <div>
      <SubmitFormButton
        className={coreStyle.mr1}
        isSubmitting={isLoading}
        loading={isLoading}
        buttonText="form.submit.validate"
      />
    </div>
  );
};

export default WallCreateAccountSubmit;
