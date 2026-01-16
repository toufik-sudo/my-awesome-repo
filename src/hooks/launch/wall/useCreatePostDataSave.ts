import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { useIntl } from 'react-intl';

import PostsApi from 'api/PostsApi';
import usePlatformIdSelection from 'hooks/wall/slider/usePlatformIdSelection';
import { PostListContext } from 'components/molecules/wall/blocks/WallBaseBlock';
import { useWallSelection } from 'hooks/wall/useWallSelection';
import { POST_CONFIDENTIALITY_TYPES } from 'constants/wall/posts';
import { getPostCreateData, getPostDateHandler, validatePostFile } from 'services/WallServices';
import { notifyPostCreated } from 'store/actions/wallActions';
import { validatePostCreation } from 'services/posts/postsServices';
import { useCreatePostWithConfidentiality } from 'hooks/launch/wall/useCreatePostWithConfidentiality';

const postsApi = new PostsApi();

/**
 * Hook used to handle Create Post Data Save
 * @param postType
 * @param isPinned
 */
export const useCreatePostDataSave = (postType, isPinned, setIsPinned) => {
  const dispatch = useDispatch();
  const intl = useIntl();
  const { selectedProgramId } = useWallSelection();
  const platformId = usePlatformIdSelection();
  const { setTriggerPin } = useContext(PostListContext);

  const createPostNameState = useState('');
  const createPostTextState = useState('');
  const [postFile, setPostFile] = useState<any>({});
  const postDateHandler = useMemo(() => getPostDateHandler(postType), [postType]);
  const [postDate, setPostDate] = useState<any>(postDateHandler.initialize());
  const [allDataValid, setDataStatus] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [hasError, setHasError] = useState(false);
  const [hasContentError, setHasContentError] = useState(false);

  const {
    confidentiality,
    setPostConfidentiality,
    selectedUsers,
    onChangeConfidentiality
  } = useCreatePostWithConfidentiality(selectedProgramId);

  const notify = useCallback(() => {
    const message = intl.formatMessage(
      { id: `wall.posts.create.${postType.toLowerCase()}` },
      { title: createPostNameState[0] }
    );
    toast(message);
  }, [postType, createPostNameState]);

  const handlePostCreated = () => {
    notify();
    dispatch(notifyPostCreated({ postType }));
    createPostNameState[1]('');
    createPostTextState[1]('');
    setPostFile({});
    setPostDate(postDateHandler.initialize());
    setPostConfidentiality(POST_CONFIDENTIALITY_TYPES.PROGRAM_USERS);
    setIsPinned(false);
  };

  const updatePostDate = useCallback(
    postDate => {
      setPostDate({ ...postDate, touched: true, hasError: !postDateHandler.isValid(postDate) });
    },
    [postDateHandler]
  );

  const updatePostFile = newFileUpload => {
    if (!newFileUpload || !newFileUpload.file) {
      return setPostFile({});
    }

    const validationResult = validatePostFile(newFileUpload);
    setPostFile({ ...newFileUpload, error: validationResult.error });
  };

  useEffect(() => {
    validatePostCreation(createPostNameState, createPostTextState, setHasError, setHasContentError, setDataStatus);
  }, [createPostNameState[0], createPostTextState[0]]);

  const handleNextStep = async () => {
    setIsLoading(true);
    try {
      let fileId = undefined;
      if (postFile && postFile.file) {
        fileId = await postsApi.uploadFile({
          filename: postFile.file.name,
          type: postFile.fileType.type,
          file: postFile.file
        });
      }

      await postsApi.createPost(
        getPostCreateData(
          platformId,
          postType,
          createPostNameState,
          createPostTextState,
          isPinned,
          confidentiality,
          selectedUsers,
          selectedProgramId,
          fileId,
          postDateHandler.updateOnSubmit(postDate)
        )
      );
      setTriggerPin(i => i + 1);
      handlePostCreated();
    } catch (e) {
      toast(intl.formatMessage({ id: 'wall.posts.create.error' }));
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleNextStep,
    allDataValid: allDataValid && !postFile.error && !postDate.hasError,
    isLoading,
    hasError,
    hasContentError,
    createPostNameState,
    createPostTextState,
    postFile,
    setPostFile: updatePostFile,
    postDate,
    setPostDate: updatePostDate,
    selectedProgramId,
    confidentiality,
    onChangeConfidentiality
  };
};
