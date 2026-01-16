import React from 'react';

import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { HTML_TAGS } from 'constants/general';

import style from 'sass-boilerplate/stylesheets/components/wall/WallBasePageStructure.module.scss';
import SpringAnimation from 'components/molecules/animations/SpringAnimation';
import { setScale } from 'utils/animations';
import { DELAY_TYPES } from 'constants/animations';

/**
 * Atom component used to render Posts Summary Message
 *
 * @constructor
 */
const PostsSummaryMessage = () => {
  const { wallCenterBlock, postsSummary, postsSummaryTitle, postsSummaryContent } = style;

  return (
    <SpringAnimation settings={setScale(DELAY_TYPES.MIN)}>
      <div className={`${wallCenterBlock} ${postsSummary}`}>
        <DynamicFormattedMessage tag={HTML_TAGS.P} className={postsSummaryTitle} id={'wall.posts.summary'} />
        <DynamicFormattedMessage tag={HTML_TAGS.P} className={postsSummaryContent} id={'wall.posts.please.add.post'} />
      </div>
    </SpringAnimation>
  );
};

export default PostsSummaryMessage;
