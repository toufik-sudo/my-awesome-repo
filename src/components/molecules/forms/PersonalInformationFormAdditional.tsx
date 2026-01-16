import React from 'react';
import { useHistory } from 'react-router';

import AvatarWrapper from 'components/organisms/avatar/AvatarWrapper';
import PersonalInformationTerms from 'components/molecules/onboarding/PersonalInformationTerms';
import SubmitFormButton from 'components/atoms/ui/ButtonSubmitForm';
import BackButton from 'components/atoms/ui/ButtonBack';
import { SUBSCRIPTION_ROUTE } from 'constants/routes';
import { emptyFn, checkIsFreePlanCookie } from 'utils/general';

import style from 'assets/style/components/PersonalInformation/PersonalInformation.module.scss';
import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';

/**
 * Molecule component used in addition of personal information form
 *
 * @param form
 * @param formLoading
 * @param isMinimumSuperAdmin
 * @constructor
 */
const PersonalInformationFormAdditional = ({ form, formLoading, isMinimumSuperAdmin, isExistingSuperAdminInvite = null }) => {
  const { push } = useHistory();
  // console.log("TEST BRIGAND")
  console.log(form)
  return (
    <div className={style.extraInfo}>
      {!isExistingSuperAdminInvite && <AvatarWrapper {...{ form, imageError: '', setImageError: emptyFn }} />}
      <PersonalInformationTerms />
      <div
        className={
          isMinimumSuperAdmin
            ? ''
            : `${coreStyle.displayFlex} ${coreStyle['flex-space-between']} ${style.buttonWrapper}`
        }
      >
        {/* {!checkIsFreePlanCookie() && !isMinimumSuperAdmin && <BackButton onClick={() => push(SUBSCRIPTION_ROUTE)} />} */}
        <SubmitFormButton
          className={coreStyle.mt0}
          isSubmitting={form.isSubmitting}
          buttonText="form.submit.go"
          loading={formLoading}
        />
      </div>
    </div>
  );
};

export default PersonalInformationFormAdditional;
