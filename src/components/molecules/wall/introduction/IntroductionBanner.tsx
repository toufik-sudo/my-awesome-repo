import React from 'react';

import { useSelectedProgramDesign } from 'hooks/wall/ui/useSelectedProgramColors';

import style from 'sass-boilerplate/stylesheets/components/wall/beneficiary/IntroBlock.module.scss';
import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';

/**
 * Molecule component used to render introduction banner
 *
 * @param title
 * @param image
 * @constructor
 */
const IntroductionBanner = ({ title, image }) => {
  const { textCenter, withBoldFont, withBackgroundImage } = coreStyle;
  const { introBlockBanner, introBlockBannerTitle } = style;
  const { colorTitle } = useSelectedProgramDesign();

  return (
    <div style={{ backgroundImage: `url('${image}')` }} className={`${introBlockBanner} ${withBackgroundImage}`}>
      <p style={{ color: colorTitle }} className={`${introBlockBannerTitle} ${textCenter} ${withBoldFont}`}>
        {title}
      </p>
    </div>
  );
};

export default IntroductionBanner;
