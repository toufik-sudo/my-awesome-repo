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

  if (!hasSocialAccounts) return null;

  return (
    <div>
      <DynamicFormattedMessage tag={HTML_TAGS.P} id="wall.socialAccounts.title" className={socialAccountTitle} />
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
                <FontAwesomeIcon icon={['fab', key] as any} />
              ) : (
                <img src={require(`assets/images/socials/social_icon_${key}.svg`)} alt={key} />
              )}
            </a>
          );
        }
      })}
    </div>
  );
};

export default SocialAccounts;
