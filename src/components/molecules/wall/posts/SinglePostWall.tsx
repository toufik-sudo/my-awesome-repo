import React from 'react';
import { useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import useOnDeletePost from 'hooks/wall/posts/useOnDeletePosts';
import ButtonFormatted from 'components/atoms/ui/ButtonFormatted';
import PostBlock from 'components/molecules/wall/PostBlock';
import Loading from 'components/atoms/ui/Loading';
import ConfirmationModal from 'components/organisms/modals/ConfirmationModal';
import useLockProgramSelection from 'hooks/general/useLockProgramSelection';
import useLoadSinglePost from 'components/molecules/wall/posts/UseLoadSinglePost';
import LocalModal from 'components/organisms/modals/LocalModal';
import useUnmount from 'hooks/general/useUnmount';
import { LOADER_TYPE, HTML_TAGS } from 'constants/general';
import { setOnRedirectData } from 'store/actions/wallActions';
import { BUTTON_MAIN_TYPE } from 'constants/ui';
import { PostListContext } from 'components/molecules/wall/blocks/WallBaseBlock';
import { getConfidentialityOnlyOptions } from 'services/posts/postsServices';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { useWallSelection } from 'hooks/wall/useWallSelection';
import { CONFIDENTIALITY_OPTIONS_ICONS } from 'constants/wall/posts';

import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';

/**
 * Renders a single post for the given postId and a rerender all posts button
 *
 * @constructor
 */
const SinglePostWall = () => {
  const {
    textXl,
    mr1,
    textMd,
    withPrimaryColor,
    withGrayLightAccentColor,
    displayFlex,
    width2,
    height2,
    mb2,
    withSecondaryColor
  } = coreStyle;

  const dispatch = useDispatch();
  const { postId, data, type, username } = useWallSelection().redirectData;
  const resetRedirectData = () => dispatch(setOnRedirectData({}));

  const { isLoading, post, showModal, setShowModal } = useLoadSinglePost(postId, type);
  const { openConfirmDeleteModal, onDeletePost, postIdToBeDeleted } = useOnDeletePost(resetRedirectData);

  useUnmount(resetRedirectData);

  useLockProgramSelection();

  return (
    <PostListContext.Provider value={{ setTriggerPin: resetRedirectData }}>
      {!isLoading && post && (
        <>
          <ButtonFormatted onClick={resetRedirectData} type={BUTTON_MAIN_TYPE.PRIMARY} buttonText="wall.back" />
          <PostBlock
            {...{
              post,
              openConfirmDeleteModal,
              postIdToBeDeleted,
              shouldRenderPin: false
            }}
          />
        </>
      )}
      {isLoading && <Loading type={LOADER_TYPE.PAGE} />}

      <ConfirmationModal question="wall.post.delete.question" onAccept={onDeletePost} />

      <LocalModal isOpen={showModal && post} closeModal={() => setShowModal(false)} shouldConfirm={true}>
        <div className={textXl}>
          {showModal &&
            getConfidentialityOnlyOptions().map(({ type, label }, key) => {
              const isNewOption = data && data.to === type;
              const isOldOption = data && data.from === type;

              if (!isNewOption && !isOldOption) return null;

              return (
                <div
                  key={key}
                  className={`${displayFlex} ${coreStyle['flex-wrap']} ${coreStyle['flex-center-vertical']} ${mb2}`}
                >
                  <FontAwesomeIcon
                    icon={CONFIDENTIALITY_OPTIONS_ICONS[type]}
                    className={`${width2} ${height2} ${mr1} ${isOldOption ? withGrayLightAccentColor : ''} ${
                      isNewOption ? withPrimaryColor : ''
                    }`}
                  />
                  <DynamicFormattedMessage
                    id={label}
                    tag={HTML_TAGS.P}
                    className={`${textMd} ${mr1} ${isNewOption ? withPrimaryColor : ''} ${
                      isOldOption ? withGrayLightAccentColor : ''
                    }`}
                  />
                  {isNewOption && <span className={`${textMd} ${withSecondaryColor}`}>{username}</span>}
                </div>
              );
            })}
        </div>
      </LocalModal>
    </PostListContext.Provider>
  );
};

export default SinglePostWall;
