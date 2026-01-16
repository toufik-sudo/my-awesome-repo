import React from 'react';

import ButtonSwitch from 'components/atoms/ui/ButtonSwitch';
import { CAN_NEXT_STEP } from 'constants/wall/launch';

import style from 'sass-boilerplate/stylesheets/components/launch/SocialNetworks.module.scss';
import { validateUrl } from '../../../../services/FormServices';

/**
 * Molecule component used to render social network switch
 * @param socialNetwork
 * @param setNetwork
 * @param index
 * @constructor
 */
const SocialNetworkSwitch = ({ socialNetwork, setNetwork, index }) => {
  const setIsChecked = isActive => {
    setNetwork(
      {
        active: isActive,
        [CAN_NEXT_STEP]: isActive ? socialNetwork.value.length !== 0 : true,
        hasError: isActive ? !!socialNetwork.value.length && !validateUrl(socialNetwork.value) : false
      },
      index
    );
  };

  return (
    <ButtonSwitch
      className={style.socialNetworksSwitchButton}
      isChecked={socialNetwork.active}
      setIsChecked={isActive => setIsChecked(isActive)}
    />
  );
};

export default SocialNetworkSwitch;
