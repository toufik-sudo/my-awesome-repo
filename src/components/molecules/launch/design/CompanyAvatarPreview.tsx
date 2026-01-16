import React from 'react';

import AvatarPreview from 'components/organisms/avatar/AvatarPreview';
import { DesignAvatarContext } from 'components/pages/DesignPage';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';

import style from 'assets/style/components/launch/Design.module.scss';

/**
 * Molecule component used to display avatar preview and title
 *
 * @constructor
 */
const CompanyAvatarPreview = () => {
  const { designTitle, designAvatarPreview } = style;

  return (
    <div className={designAvatarPreview}>
      <DynamicFormattedMessage tag="p" id="launchProgram.coverPreview.label" className={designTitle} />
      <AvatarPreview {...{ style }} context={DesignAvatarContext} />
    </div>
  );
};

export default CompanyAvatarPreview;
