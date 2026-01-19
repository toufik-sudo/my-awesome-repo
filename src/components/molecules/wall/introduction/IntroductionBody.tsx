import React, { useMemo } from 'react';

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
 * Parse Draft.js content to plain text
 */
const parseDraftContent = (content: string): string => {
  try {
    const parsed = JSON.parse(content);
    if (parsed.blocks && Array.isArray(parsed.blocks)) {
      return parsed.blocks.map((block: { text: string }) => block.text).join(' ');
    }
    return content;
  } catch {
    return content;
  }
};

/**
 * Format ISO date to readable format
 */
const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return dateString;
  }
};

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
  termsAndConditionsUrl,
  pictureUrl,
  bannerTitle,
  isTooltip = false
}) => {
  const { colorTitle } = useSelectedProgramDesign();
  const { w100, mb2, textCenter, withBoldFont, withFontSmall } = coreStyle;

  // Parse content if it's Draft.js format
  const parsedContent = useMemo(() => {
    if (!content) return '';
    return parseDraftContent(content);
  }, [content]);

  // Format dates
  const formattedStartDate = useMemo(() => {
    if (!startDate) return '';
    return formatDate(startDate);
  }, [startDate]);

  const formattedEndDate = useMemo(() => {
    if (!endDate) return '';
    return formatDate(endDate);
  }, [endDate]);

  // Check if there are any social media accounts
  const hasSocialMedia = useMemo(() => {
    if (!socialMedia) return false;
    return Object.values(socialMedia).some(value => value !== null && value !== '');
  }, [socialMedia]);

  // Tooltip-specific layout
  if (isTooltip) {
    return (
      <div className={style.introBlockTooltip}>
        {pictureUrl && (
          <img 
            src={pictureUrl} 
            alt={bannerTitle || title || 'Program'} 
            className={style.introBlockTooltipImage}
          />
        )}
        <div className={style.introBlockTooltipBody}>
          <div className={style.introBlockTooltipHeader}>
            <div>
              <DynamicFormattedMessage
                tag={HTML_TAGS.P}
                id="wall.intro.welcome"
                className={style.introBlockTooltipWelcome}
              />
              {(bannerTitle || title) && (
                <h4 className={style.introBlockTooltipTitle} style={{ color: colorTitle }}>
                  {bannerTitle || title}
                </h4>
              )}
            </div>
          </div>
          
          {parsedContent && (
            <div className={style.introBlockTooltipContent}>
              <p>{parsedContent}</p>
            </div>
          )}
          
          {(formattedStartDate || formattedEndDate) && (
            <div className={style.introBlockTooltipDates}>
              {formattedStartDate && (
                <div className={style.introBlockTooltipDateItem}>
                  <span className={style.introBlockTooltipDateItemLabel}>
                    <DynamicFormattedMessage tag={HTML_TAGS.SPAN} id="wall.intro.start" defaultMessage="Début" />
                  </span>
                  <span style={{ color: colorTitle }}>{formattedStartDate}</span>
                </div>
              )}
              {formattedEndDate && (
                <div className={style.introBlockTooltipDateItem}>
                  <span className={style.introBlockTooltipDateItemLabel}>
                    <DynamicFormattedMessage tag={HTML_TAGS.SPAN} id="wall.intro.end" defaultMessage="Fin" />
                  </span>
                  <span style={{ color: colorTitle }}>{formattedEndDate}</span>
                </div>
              )}
            </div>
          )}
          
          {hasSocialMedia && (
            <div className={style.introBlockTooltipSocial}>
              <SocialAccounts socialMedia={socialMedia} />
            </div>
          )}
          
          {termsAndConditionsUrl && (
            <div className={style.introBlockTooltipFooter}>
              <DynamicFormattedMessage
                tag={HTML_TAGS.ANCHOR}
                id="wall.intro.terms"
                target={LINK_TARGET.BLANK}
                href={termsAndConditionsUrl}
              />
            </div>
          )}
        </div>
      </div>
    );
  }

  // Original layout for non-tooltip usage
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
