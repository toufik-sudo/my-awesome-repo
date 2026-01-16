import React from 'react';

import PasswordResetFormWrapper from '../organisms/form-wrappers/PasswordResetFormWrapper';
import SuccessModal from '../organisms/modals/SuccessModal';
import { PASSWORD_RESET, ROOT } from '../../constants/routes';

import landingImage from 'assets/images/landingBg.jpg';
import componentStyle from '../../sass-boilerplate/stylesheets/components/landing/UserActions.module.scss';
import coreStyle from '../../sass-boilerplate/stylesheets/style.module.scss';
import ButtonFormatted from '../atoms/ui/ButtonFormatted';
import { BUTTON_MAIN_TYPE } from '../../constants/ui';
import { useHistory } from 'react-router';

/**
 * Page component used to render login page
 *
 * @constructor
 */
const PasswordResetPage = () => {
  const { formWrapper, backToLanding, userActionPage } = componentStyle;
  const { withBackgroundImage, contentCentered } = coreStyle;
  const history = useHistory();

  return (
    <>
      <section
        className={`${userActionPage} ${withBackgroundImage} ${contentCentered}`}
        style={{
          backgroundImage: `linear-gradient(133deg, rgba(54,185,146,.3) 0%, rgba(54,185,146,.3) 35%, rgba(112,198,132,.3) 73%, rgba(170,211,117,.3) 100%),  url(${landingImage})`
        }}
        id={PASSWORD_RESET}
      >
        <ButtonFormatted
          type={BUTTON_MAIN_TYPE.PRIMARY}
          onClick={() => history.push(ROOT)}
          buttonText="modal.success.button.reset"
          className={backToLanding}
        />
        <div className={formWrapper}>
          <PasswordResetFormWrapper />
        </div>
      </section>
      <SuccessModal closeButtonHidden={false} isOnboardingFlow={false} />
    </>
  );
};

export default PasswordResetPage;
