import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { LINK_TARGET } from 'constants/ui';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { HTML_TAGS } from 'constants/general';
import { SOCIAL } from 'constants/wall/launch';

import style from 'sass-boilerplate/stylesheets/components/wall/beneficiary/IntroBlock.module.scss';

/**
 * Molecule component used to render social accounts
 *
 * @param socialMedia
 * @constructor
 */
const SocialAccounts = ({ socialMedia }) => {
  const hasSocialAccounts = Object.keys(socialMedia).filter(key => !!socialMedia[key]).length;
  const { socialAccount, socialAccountTitle } = style;
  const getCustomIcon = () => {
    try {
      return require('assets/images/socials/social_icon_custom.png').default;
    } catch (e) {
      return require('assets/images/socials/social_icon_custom.png');
    }
  };

  if (!hasSocialAccounts) return null;

  return (
    <div className={style.introBlockTooltipSocial}>

      {Object.keys(socialMedia).map(key => {
        if (socialMedia[key]) {
          let finalUrl = socialMedia[key];
          if (!socialMedia[key].includes('http')) finalUrl = `https://${finalUrl}`;

          return (
            <a
              href={finalUrl}
              target={LINK_TARGET.BLANK}
              rel="noopener noreferrer"
              className={`${style[key]} ${socialAccount}`}
              title={key}
            >
              {key !== SOCIAL.CUSTOM ? (
                <FontAwesomeIcon icon={['fab', key === 'instagram' ? 'instagram' : key] as any} />
              ) : (
                <img src={getCustomIcon()} alt={key} />
              )}
            </a>
          );
        }
      })}
    </div>
  );
};

export default SocialAccounts;
