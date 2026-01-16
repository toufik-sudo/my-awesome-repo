import React from 'react';

import ForgotPasswordFormWrapper from '../organisms/form-wrappers/ForgotPasswordFormWrapper';
import SuccessModal from 'components/organisms/modals/SuccessModal';
import { FORGOT_PASSWORD, ROOT } from 'constants/routes';

import landingImage from 'assets/images/landingBg.jpg';
import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';
import componentStyle from 'sass-boilerplate/stylesheets/components/landing/UserActions.module.scss';
import ButtonFormatted from '../atoms/ui/ButtonFormatted';
import { BUTTON_MAIN_TYPE } from '../../constants/ui';
import { useHistory } from 'react-router';

/**
 * Page component used to renders the forgot password page
 *
 * @constructor
 */
const ForgotPasswordPage = () => {
  const { formWrapper, backToLanding, userActionPage } = componentStyle;
  const { contentCentered } = coreStyle;
  const history = useHistory();

  return (
    <>
      <section
        className={`${userActionPage} ${contentCentered}`}
        style={{
          backgroundImage: `linear-gradient(133deg, rgba(54,185,146,.3) 0%, rgba(54,185,146,.3) 35%, rgba(112,198,132,.3) 73%, rgba(170,211,117,.3) 100%),  url(${landingImage})`
        }}
        id={FORGOT_PASSWORD}
      >
        <ButtonFormatted
          type={BUTTON_MAIN_TYPE.PRIMARY}
          onClick={() => history.push(ROOT)}
          buttonText="modal.success.button.reset"
          className={backToLanding}
        />
        <div className={formWrapper}>
          <ForgotPasswordFormWrapper isOnboardingFlow={false} />
        </div>
      </section>
      <SuccessModal closeButtonHidden={false} isOnboardingFlow={false} />
    </>
  );
};

export default ForgotPasswordPage;
