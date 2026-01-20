import React from 'react';
import { Link } from 'react-router-dom';

import importedLogo from 'assets/images/logo/logo_ia.png';
import { CLOUD_REWARDS_LOGO_ALT } from 'constants/general';
import { ROOT } from 'constants/routes';
import { useDispatch } from 'react-redux';
import { forceActiveProgram } from 'store/actions/wallActions';
import usePlatformIdSelection from 'hooks/wall/slider/usePlatformIdSelection';

import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';

/**
 * Atom component used to render a link with a logo image
 *
 * @param className
 * @param logo
 * @param disabled
 * @constructor
 *
 * @see LogoImageLinkStory
 */
const LogoImageLink = ({ className, logo = importedLogo, disabled = false }) => {
  const forcedPlatformId = usePlatformIdSelection();
  const dispatch = useDispatch();

  let linkComponent = (
    <div className={coreStyle['flex-center-total']}>
      <img src={logo} alt={CLOUD_REWARDS_LOGO_ALT} {...{ className }} />
    </div>
  );

  if (!disabled) {
    linkComponent = (
      <Link to={ROOT} onClick={() => dispatch(forceActiveProgram({ forcedPlatformId, unlockSelection: true }))}>
        <img src={logo} alt={CLOUD_REWARDS_LOGO_ALT} {...{ className }} />
      </Link>
    );
  }

  return linkComponent;
};

export default LogoImageLink;
