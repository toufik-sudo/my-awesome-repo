import React from 'react';
import { useIntl } from 'react-intl';

import Button from 'components/atoms/ui/Button';
import { BUTTON_MAIN_TYPE } from 'constants/ui';

import postStyle from 'sass-boilerplate/stylesheets/components/wall/PostList.module.scss';
import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';

/**
 * Atom component used to render close button
 * @param setShowPostBlock
 * @constructor
 */
const CloseCreatePost = ({ setShowPostBlock }) => {
  const { pl1 } = coreStyle;
  const intl = useIntl();

  return (
    <span className={pl1}>
      <Button type={BUTTON_MAIN_TYPE.DANGER} className={postStyle.postCTA} onClick={() => setShowPostBlock(false)}>
        {intl.formatMessage({ id: 'wall.posts.confidentiality.cancel' })}
      </Button>
    </span>
  );
};

export default CloseCreatePost;
