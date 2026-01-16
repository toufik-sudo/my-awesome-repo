import React from 'react';
import LoginFormWrapper from 'components/organisms/form-wrappers/LoginFormWrapper';
import { LOGIN } from 'constants/routes';
import landingImage from 'assets/images/shutterstock_2002025357.png';
import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';
import componentStyle from 'sass-boilerplate/stylesheets/components/landing/UserActions.module.scss';

/**
 * Page component used to render login page
 *
 * @constructor
 */
const LoginPage = () => {
  const { userActionPage, formWrapper } = componentStyle;
  const { contentCentered } = coreStyle;

  return (
    <>
      <section
        className={`${userActionPage} ${contentCentered}`}
        style={{
          backgroundImage: `url(${landingImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
        id={LOGIN}
      >
        <div className={formWrapper}>
          <LoginFormWrapper isOnboardingFlow={false} />
        </div>
      </section>
    </>
  );
};

export default LoginPage;
