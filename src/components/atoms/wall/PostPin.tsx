import React, { useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapPin } from '@fortawesome/free-solid-svg-icons';
import { useDispatch } from 'react-redux';

import usePlatformIdSelection from 'hooks/wall/slider/usePlatformIdSelection';
import { HTML_TAGS } from 'constants/general';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { setPinStatus } from 'store/actions/wallActions';
import { usePinData } from 'hooks/wall/usePinData';
import { PostListContext } from 'components/molecules/wall/blocks/WallBaseBlock';

import grid from 'sass-boilerplate/stylesheets/vendors/bootstrap-grid.module.scss';
import style from 'sass-boilerplate/stylesheets/components/wall/PostList.module.scss';
import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';

/**
 * Atom component used to show post pin block
 * @param isPinned
 * @param id
 * @param type
 * @param programs
 * @constructor
 */
const PostPin = ({ isPinned, id, type, programs }) => {
  const { setTriggerPin } = useContext(PostListContext);
  const { likeType, isDisabled, setIsDisabled } = usePinData(type);
  const dispatch = useDispatch();
  const { postBlockIsLikedBtn, postBlockDisabled, postActionBlock } = style;
  const platformId = usePlatformIdSelection();

  return (
    <div className={`${grid['mr-1']} ${postActionBlock}`}>
      <div
        className={coreStyle.pointer}
        onClick={() => setPinStatus({ isPinned, id, programs, dispatch, setTriggerPin, setIsDisabled, platformId })}
      >
        <FontAwesomeIcon icon={faMapPin} className={`${grid['mr-2']} ${grid['mr-md-3']}`} />
        <DynamicFormattedMessage
          tag={HTML_TAGS.SPAN}
          id={`wall.posts.${isPinned ? 'pinned' : 'pin'}`}
          className={`${postBlockIsLikedBtn} ${isPinned ? likeType : ''} ${isDisabled ? postBlockDisabled : ''}`}
        />
      </div>
    </div>
  );
};

export default PostPin;
