import React from 'react';
import draftToHtml from 'draftjs-to-html';

import JsonUtilities from 'utils/JsonUtilities';
import MomentUtilities from 'utils/MomentUtilities';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { HTML_TAGS } from 'constants/general';
import { useSelectedProgramDesign } from 'hooks/wall/ui/useSelectedProgramColors';

import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';
import style from 'sass-boilerplate/stylesheets/components/wall/beneficiary/IntroBlock.module.scss';
import { useUserRole } from '../../../../hooks/user/useUserRole';
import { isUserBeneficiary } from '../../../../services/security/accessServices';

/**
 * Molecule component used to render introduction body content
 *
 * @param startDate
 * @param content
 * @param title
 * @param endDate
 * @constructor
 */
const IntroductionBodyContent = ({ startDate, content, title, endDate }) => {
  const { colorContent, colorTitle } = useSelectedProgramDesign();
  const { withFontSmall, withBoldFont, withFontTitle } = coreStyle;
  const contentHtml = content && JsonUtilities.safeParse(content);
  const role = useUserRole();
  const isBeneficiary = isUserBeneficiary(role);

  return (
    <>
      <p style={{ color: colorContent }}>
        {MomentUtilities.formatDate(startDate)}
        {endDate && ' - ' + MomentUtilities.formatDate(endDate)}
      </p>
      {!isBeneficiary && (
        <DynamicFormattedMessage
          style={{ color: colorContent }}
          tag={HTML_TAGS.P}
          id="wall.intro.date.info"
          className={withFontSmall}
        />
      )}
      <p className={`${style.introBlockBodyTitle} ${withBoldFont} ${withFontTitle}`} style={{ color: colorTitle }}>
        {title}
      </p>
      {content && (
        <div
          style={{ color: colorContent }}
          dangerouslySetInnerHTML={{ __html: contentHtml ? draftToHtml(contentHtml) : content }}
        />
      )}
    </>
  );
};

export default IntroductionBodyContent;
