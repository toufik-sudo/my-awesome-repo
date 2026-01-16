import React from 'react';

import ProgramNewsletterOption from 'components/atoms/programs/ProgramNewsletterOption';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { buildEmbbededHtmlPart } from 'services/IntlServices';
import { HTML_TAGS } from 'constants/general';

import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';

/**
 * Component that renders program newsletter options
 * @param newsletter
 * @param setNewsletter
 * @constructor
 */
const ProgramNewsletterOptions = ({ newsletter, setNewsletter }) => {
  const { displayFlex, mb2, mt2, w50, smallText, mLargeJustifyContentCenter, mLargeWidthFull } = coreStyle;

  return (
    <>
      <DynamicFormattedMessage
        id="program.join.newsletter.question"
        tag={HTML_TAGS.P}
        values={{
          strong: buildEmbbededHtmlPart({ tag: HTML_TAGS.STRONG })
        }}
      />
      <em className={smallText}>
        <DynamicFormattedMessage id="program.join.newsletter.explanation.1" tag={HTML_TAGS.P} />
        <DynamicFormattedMessage id="program.join.newsletter.explanation.2" tag={HTML_TAGS.P} />
      </em>
      <div
        className={`${displayFlex} ${mLargeWidthFull} ${mLargeJustifyContentCenter} ${w50} ${coreStyle['flex-direction-row']} ${mt2}`}
      >
        <ProgramNewsletterOption
          labelId="form.label.radio.accept"
          isSelected={newsletter}
          onChange={() => setNewsletter(true)}
        />
        <ProgramNewsletterOption
          labelId="form.label.radio.decline"
          isSelected={!newsletter}
          onChange={() => setNewsletter(false)}
        />
      </div>
    </>
  );
};
export default ProgramNewsletterOptions;
