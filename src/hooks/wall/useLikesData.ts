import { useDispatch, useSelector } from 'react-redux';
import { useContext, useEffect, useState } from 'react';

import { IStore } from 'interfaces/store/IStore';
import { TDynamicObject } from 'interfaces/IGeneral';
import { POST_TYPE } from 'constants/wall/posts';
import { UserContext } from 'components/App';
import { setModalState } from 'store/actions/modalActions';
import { LIKES_MODAL } from 'constants/modal';

import style from 'sass-boilerplate/stylesheets/components/wall/PostList.module.scss';

/**
 * Hook used to retrieve likes data and return likes state
 * @param post
 */
export const useLikesData: (post) => TDynamicObject = post => {
  const { likes, likeId, id, type, nrOfLikes } = post;
  const [postIsLiked, setIsLiked] = useState(likeId);
  const noOfLikesState = useState(nrOfLikes);
  const [isDisabled, setIsDisabled] = useState(false);
  const { postBlockIsLikedBtnExpress, postBlockIsLikedBtnTask } = style;
  const postType = type === POST_TYPE.TASK ? postBlockIsLikedBtnTask : postBlockIsLikedBtnExpress;
  const [likeNames, setLikeNames] = useState<string[]>(!nrOfLikes ? [] : likes);
  const [showOwnLike, addRemoveNames] = useState();
  const likesModal = useSelector(state => (state as IStore).modalReducer.likesModal);
  const dispatch = useDispatch();
  const {
    userData: { firstName, lastName }
  } = useContext(UserContext);
  const currentUser = firstName + ' ' + lastName;

  const showLikesModal = (showLikes, postId) => {
    return dispatch(setModalState(showLikes, LIKES_MODAL, { postId }));
  };

  useEffect(() => {
    if (showOwnLike) {
      setLikeNames(names => [currentUser, ...names]);
    }
    if (showOwnLike === false) {
      setLikeNames(names => names.filter(name => name !== currentUser));
    }
  }, [showOwnLike]);

  return {
    id,
    postIsLiked,
    noOfLikesState,
    postType,
    isDisabled,
    setIsDisabled,
    setIsLiked,
    likeNames,
    addRemoveNames,
    showLikesModal,
    likesModal,
    currentUser
  };
};
