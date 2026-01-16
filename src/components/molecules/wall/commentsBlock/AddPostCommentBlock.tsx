import React, { useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';

import CreatePostFile from 'components/molecules/wall/postBlock/CreatePostFile';
import UploadedFile from 'components/atoms/wall/UploadedFile';
import CreateNewTextareaField from 'components/atoms/launch/products/CreateNewTextareaField';
import DynamicFormattedError from 'components/atoms/ui/DynamicFormattedError';
import { useCreateComment } from 'hooks/wall/comments/useCreateComments';
import { ADD_COMMENT, COMMENT_FILE_TYPE_OPTIONS } from 'constants/wall/posts';
import { emptyFn } from 'utils/general';
import { UserContext } from 'components/App';

import style from 'sass-boilerplate/stylesheets/components/wall/PostComments.module.scss';
import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';

/**
 * Molecule component used to render add comment block
 * @param type
 * @param id
 * @constructor
 */
const AddPostCommentBlock = ({ type, id }) => {
  const { displayFlex, withSecondaryColor, relative } = coreStyle;
  const { commentProfilePicture, addCommentButtons, submitComment, isFileSelected, addCommentInput } = style;
  const {
    commentContent,
    setCommentContent,
    hasContentError,
    addComment,
    setCommentFile,
    commentFile,
    isLoading,
    contentLengthError
  } = useCreateComment(type, id);
  const { userData = {} } = useContext(UserContext);

  const disableSubmitBtn = isLoading || hasContentError || commentFile.error;

  return (
    <>
      <div className={`${displayFlex} ${relative}`}>
        <img className={commentProfilePicture} alt={userData.name} src={userData.croppedPicturePath} />
        <CreateNewTextareaField
          onChange={e => setCommentContent(e.target.value)}
          type={ADD_COMMENT}
          value={commentContent}
          customClass={`${addCommentInput} ${Object.keys(commentFile).length ? isFileSelected : ''}`}
        />
        <div className={`${addCommentButtons}`}>
          <UploadedFile {...{ onRemove: setCommentFile, postFile: commentFile }} />
          <CreatePostFile {...{ setPostFile: setCommentFile, fileOptions: COMMENT_FILE_TYPE_OPTIONS }} />
          <FontAwesomeIcon
            className={`${submitComment} ${disableSubmitBtn ? '' : withSecondaryColor}`}
            icon={faPaperPlane}
            onClick={disableSubmitBtn ? emptyFn : addComment}
          />
        </div>
      </div>
      <DynamicFormattedError hasError={contentLengthError} id={`form.validation.comment.too.long`} />
      <DynamicFormattedError
        hasError={commentFile.error}
        id={`${commentFile.error}`}
        values={{ maxMbSize: commentFile.maxSize }}
      />
    </>
  );
};

export default AddPostCommentBlock;
