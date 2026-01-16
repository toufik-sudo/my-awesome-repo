import React, { useContext } from 'react';

import MediaTextContent from 'components/atoms/wall/MediaTextContent';
import useUnmount from 'hooks/general/useUnmount';
import Loading from 'components/atoms/ui/Loading';
import ButtonFormatted from 'components/atoms/ui/ButtonFormatted';
import { getHMHourFormat } from 'services/WallServices';
import { usePinData } from 'hooks/wall/usePinData';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { HTML_TAGS, LOADER_TYPE } from 'constants/general';
import { BUTTON_MAIN_TYPE } from 'constants/ui';
import { UserContext } from 'components/App';

import style from 'sass-boilerplate/stylesheets/components/wall/PostComments.module.scss';
import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';

/**
 * Molecule component used to render post comment block
 * @param comment
 * @param type
 * @param currentPostId
 * @constructor
 */
const PostCommentBlock = ({
  comment,
  type,
  setCommentToBeDeleted,
  commentToBeDeleted,
  onDeleteComment,
  isDeleting,
  canDeleteComments
}) => {
  const { commentProfilePicture } = style;
  const {
    displayFlex,
    my1,
    smallText,
    displayBlock,
    withDangerColor,
    relative,
    absolute,
    top0,
    right0,
    pointer,
    hoverDisplayChild,
    childToBeDisplayed,
    pr15,
    left0,
    bottom0,
    withBackgroundGrayLight,
    p1,
    textCenter,
    mr15,
    withGrayColor,
    pt1
  } = coreStyle;
  const { likeType } = usePinData(type);
  const {
    createdAt,
    createdBy: { id: ownerId, croppedPicture, lastName, firstName },
    id: commentId
  } = comment;
  const {
    userData: { id: loggedUserId }
  } = useContext(UserContext);

  const canDeleteCurrentComment = canDeleteComments || loggedUserId === ownerId;

  useUnmount(() => setCommentToBeDeleted(null), [], commentToBeDeleted === commentId);

  if (commentToBeDeleted === commentId && isDeleting) return <Loading type={LOADER_TYPE.DROPZONE} />;

  return (
    <div className={`${displayFlex} ${my1} ${pt1} ${smallText} ${relative} ${hoverDisplayChild} ${pr15}`}>
      <img
        className={commentProfilePicture}
        src={croppedPicture}
        alt={`${firstName} ${lastName}`}
        title={`${firstName} ${lastName}`}
      />
      <div className={displayBlock}>
        {canDeleteCurrentComment && (
          <FontAwesomeIcon
            icon={faTimesCircle}
            className={`${withDangerColor} ${absolute} ${top0} ${right0} ${pointer} ${childToBeDisplayed}`}
            onClick={() => setCommentToBeDeleted(commentId)}
          />
        )}
        <MediaTextContent {...comment} />
        <p className={` ${likeType}`}>{getHMHourFormat(createdAt)}</p>
        {commentToBeDeleted === commentId && !isDeleting && (
          <div
            className={`${absolute} ${top0} ${left0} ${right0} ${bottom0} ${textCenter} ${withBackgroundGrayLight} ${p1} ${coreStyle['flex-direction-column']} ${coreStyle['flex-center-horizontal']}`}
          >
            <DynamicFormattedMessage className={withGrayColor} id="wall.comment.delete.question" tag={HTML_TAGS.P} />
            <div>
              <ButtonFormatted
                onClick={() => onDeleteComment()}
                type={BUTTON_MAIN_TYPE.PRIMARY}
                buttonText="confirmation.cta.yes"
                className={mr15}
              />
              <ButtonFormatted
                onClick={() => setCommentToBeDeleted(null)}
                type={BUTTON_MAIN_TYPE.DANGER}
                buttonText="confirmation.cta.no"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostCommentBlock;
