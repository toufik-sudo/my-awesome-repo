import React from 'react';

import ProgramInformationBlock from 'components/molecules/wall/blocks/ProgramInformationBlock';
import SocialAccounts from 'components/molecules/wall/introduction/SocialAccounts';
import IntroductionBodyContent from 'components/molecules/wall/introduction/IntroductionBodyContent';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { HTML_TAGS } from 'constants/general';

import style from 'sass-boilerplate/stylesheets/components/wall/beneficiary/IntroBlock.module.scss';
import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';
import { LINK_TARGET } from 'constants/ui';
import { useSelectedProgramDesign } from 'hooks/wall/ui/useSelectedProgramColors';

/**
 * Molecule component used to render introduction banner
 *
 * @param title
 * @param image
 * @constructor
 */
const IntroductionBody = ({
  date: { endDate, startDate },
  title,
  content,
  socialMedia,
  isBodyOpen,
  setBody,
  termsAndConditionsUrl
}) => {
  const { colorTitle } = useSelectedProgramDesign();
  const { w100, mb2, textCenter, withBoldFont, withFontSmall } = coreStyle;

  let contentOutput = (
    <DynamicFormattedMessage
      tag={HTML_TAGS.P}
      id="wall.intro.welcome"
      className={style.introBlockWelcomeTitle}
      style={{ color: colorTitle }}
    />
  );

  if (isBodyOpen) {
    contentOutput = (
      <>
        <DynamicFormattedMessage
          tag={HTML_TAGS.P}
          id="wall.intro.welcome"
          className={`${w100} ${textCenter} ${withBoldFont} ${mb2}`}
          style={{ color: colorTitle }}
        />
        <IntroductionBodyContent {...{ endDate, content, title, startDate }} />
        <SocialAccounts {...{ socialMedia }} />
        <DynamicFormattedMessage
          tag={HTML_TAGS.ANCHOR}
          id="wall.intro.terms"
          target={LINK_TARGET.BLANK}
          href={termsAndConditionsUrl}
          className={withFontSmall}
        />
      </>
    );
  }

  return <ProgramInformationBlock {...{ isBodyOpen, setBody }}>{contentOutput}</ProgramInformationBlock>;
};

export default IntroductionBody;
