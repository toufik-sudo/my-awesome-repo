import React from 'react';

import SpringAnimation from 'components/molecules/animations/SpringAnimation';
import DynamicComponent from 'components/molecules/DynamicComponent';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { HTML_TAGS } from 'constants/general';
import { setTranslate } from 'utils/animations';
import { DELAY_INITIAL } from 'constants/animations';

import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';
import radioStyle from 'sass-boilerplate/stylesheets/components/launch/Cube.module.scss';

/**
 * Molecule component used to render invitation element;
 * @param invitationType
 * @param active
 * @param setActive
 * @param translationKey
 * @constructor
 */
const InviteUserElement = ({ invitationType, active, setActive }) => {
  const { cubeRadioItem, cubeRadioItemSelected } = radioStyle;
  const { displayBlock, displayFlex, m3, pointer } = coreStyle;
  const isActive = active === invitationType.id;
  const translationKey = 'wall.send.invitation.';

  return (
    <div className={displayBlock}>
      <div className={`${displayFlex} ${pointer}`} onClick={() => setActive(invitationType.id)}>
        <div className={`${cubeRadioItem} ${isActive ? cubeRadioItemSelected : ''}`} />
        <DynamicFormattedMessage tag={HTML_TAGS.P} id={`${translationKey}${invitationType.id}.title`} />
      </div>
      {isActive && (
        <SpringAnimation settings={setTranslate(DELAY_INITIAL)}>
          <div className={m3}>
            <DynamicComponent props={{ translationKey, id: invitationType.id }} component={invitationType.component} />
          </div>
        </SpringAnimation>
      )}
    </div>
  );
};

export default InviteUserElement;
