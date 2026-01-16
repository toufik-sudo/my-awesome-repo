import React from 'react';

import CubeOption from 'components/atoms/launch/cube/CubeOption';

/**
 * Molecule component used to render reward managers options
 *
 * @param setAcceptsRewardManagers
 * @param acceptsRewardManagers
 * @constructor
 */
const RewardedManagersOptions = ({ setAcceptsRewardManagers, acceptsRewardManagers }) => (
  <div>
    <CubeOption
      {...{
        handleSelection: () => setAcceptsRewardManagers(true),
        isSelected: acceptsRewardManagers,
        translation: `form.label.radio.accept`,
        type: true
      }}
    />
    <CubeOption
      {...{
        handleSelection: () => setAcceptsRewardManagers(false),
        isSelected: !acceptsRewardManagers,
        translation: `form.label.radio.decline`,
        type: false
      }}
    />
  </div>
);

export default RewardedManagersOptions;
