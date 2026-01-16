import { TDynamicObject } from 'interfaces/IGeneral';
import { useState } from 'react';

import { useWallSelection } from 'hooks/wall/useWallSelection';
import { POST_TYPE } from 'constants/wall/posts';

import style from 'sass-boilerplate/stylesheets/components/wall/PostList.module.scss';

/**
 * Hook uesd to get programId and post type
 * @param type
 */
export const usePinData: (type) => TDynamicObject = type => {
  const { selectedProgramId } = useWallSelection();
  const [isDisabled, setIsDisabled] = useState(false);
  const { postBlockIsLikedBtnExpress, postBlockIsLikedBtnTask } = style;
  const likeType = type === POST_TYPE.TASK ? postBlockIsLikedBtnTask : postBlockIsLikedBtnExpress;

  return { programId: selectedProgramId, likeType, isDisabled, setIsDisabled };
};
