import React, { useState } from 'react';

import CloseCreatePost from 'components/molecules/wall/postBlock/CloseCreatePost';
import CreatePostAvatar from './CreatePostAvatar';
import CreatePostNextStep from 'components/atoms/wall/CreatePostNextStep';
import UploadedFile from 'components/atoms/wall/UploadedFile';
import CreateNewTextareaField from 'components/atoms/launch/products/CreateNewTextareaField';
import CreateNewInputField from 'components/atoms/launch/products/CreateNewInputField';
import DynamicFormattedError from 'components/atoms/ui/DynamicFormattedError';
import useTitleContentData from 'hooks/launch/wall/useTitleContentData';
import CreatePostFile from 'components/molecules/wall/postBlock/CreatePostFile';
import PostDateSelector from 'components/molecules/wall/postBlock/PostDateSelector';
import CreatePostPin from 'components/molecules/wall/postBlock/CreatePostPin';
import { AuthorizeIcon } from 'components/atoms/wall/AuthorizeIcon';
import { useCreatePostDataSave } from 'hooks/launch/wall/useCreatePostDataSave';
import { CREATE_POST_CONTENT, CREATE_POST_TITLE, POST_FILE_UPLOAD_OPTIONS } from 'constants/wall/posts';

import style from 'sass-boilerplate/stylesheets/components/wall/WallPostBaseBlock.module.scss';

/**
 * Molecule component used to render Create Post Wrapper
 *
 * @className
 * @postType
 * @setShowPostBlock
 * @constructor
 */
const CreatePostWrapper = ({ className, postType, setShowPostBlock, color }) => {
  const [isPinned, setIsPinned] = useState(false);
  const { wallPostActions, wallPostInfo, wallPostActionsPublish, wallPostContent, wallPostTitle } = style;
  const {
    handleNextStep,
    allDataValid,
    isLoading,
    hasError,
    hasContentError,
    createPostNameState,
    createPostTextState,
    postFile,
    setPostFile,
    postDate,
    setPostDate,
    onChangeConfidentiality,
    confidentiality
  } = useCreatePostDataSave(postType, isPinned, setIsPinned);

  const { title, setTitle, content, setContent } = useTitleContentData(createPostNameState, createPostTextState);

  return (
    <>
      <div className={wallPostInfo}>
        <CreatePostAvatar />
        <div className={wallPostTitle}>
          <CreateNewInputField onChange={e => setTitle(e.target.value)} type={CREATE_POST_TITLE} value={title} />
        </div>
      </div>
      <DynamicFormattedError hasError={hasError} id="form.validation.max" />
      <div className={wallPostContent}>
        <CreateNewTextareaField onChange={e => setContent(e.target.value)} type={CREATE_POST_CONTENT} value={content} />
      </div>
      <DynamicFormattedError hasError={hasContentError} id="form.validation.max" />
      <UploadedFile {...{ onRemove: setPostFile, postFile }} />
      <div className={wallPostActions}>
        <AuthorizeIcon {...{ confidentialityType: confidentiality, onOptionChanged: onChangeConfidentiality }} />
        <CreatePostFile {...{ setPostFile, fileOptions: POST_FILE_UPLOAD_OPTIONS }} />
        <PostDateSelector {...{ postDate, setPostDate, postType }} />
        <CreatePostPin {...{ setIsPinned, isPinned }} />
      </div>
      <div className={wallPostActionsPublish}>
        <CreatePostNextStep {...{ allDataValid, handleNextStep, isLoading, className, color }} />
        <CloseCreatePost {...{ setShowPostBlock }} />
      </div>
    </>
  );
};

export default CreatePostWrapper;
