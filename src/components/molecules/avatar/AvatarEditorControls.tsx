import React from 'react';

import SliderControl from 'components/molecules/avatar/SliderControl';
import { AVATAR_CONFIG_TYPE, AVATAR_CONTROLS_TYPE, ROTATE } from 'constants/personalInformation';
import { DESIGN_COVER_MODAL, CONTENTS_COVER_MODAL } from 'constants/modal';

/**
 * Molecule component used to render avatar editor controls
 *
 * @param setRotate
 * @constructor
 *
 * @res AvatarEditorControlsStory
 */
const AvatarEditorControls = ({ avatarConfig, setAvatarConfig, imageModal }) => (
  <>
    {AVATAR_CONTROLS_TYPE.map(control => {
      // if ((imageModal === DESIGN_COVER_MODAL || imageModal === CONTENTS_COVER_MODAL) && control === ROTATE) {
      //   return null;
      // }

      return (
        <SliderControl
          key={control}
          type={control}
          config={AVATAR_CONFIG_TYPE[control]}
          value={avatarConfig}
          setValue={setAvatarConfig}
        />
      );
    })}
  </>
);

export default AvatarEditorControls;
