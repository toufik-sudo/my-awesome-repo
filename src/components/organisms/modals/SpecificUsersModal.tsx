import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { useIntl } from 'react-intl';

import Button from 'components/atoms/ui/Button';
import SpecificUsersCheckbox from 'components/molecules/wall/postBlock/confidentiality/SpecificUsersCheckbox';
import HeadingAtom from 'components/atoms/ui/Heading';
import FlexibleModalContainer from 'containers/FlexibleModalContainer';
import GenericInfiniteScroll from 'components/atoms/list/GenericInfiniteScroll';
import Loading from 'components/atoms/ui/Loading';
import DynamicFormattedError from 'components/atoms/ui/DynamicFormattedError';
import { LOADER_TYPE, HTML_TAGS } from 'constants/general';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { useSpecificUsersList } from 'hooks/wall/posts/useSpecificUsersList';
import { useSpecificUsersSelection } from 'hooks/wall/posts/useSpecificUsersSelection';
import { INPUT_LENGTH } from 'constants/validation';
import { BUTTON_MAIN_TYPE } from 'constants/ui';

import grid from 'sass-boilerplate/stylesheets/vendors/bootstrap-grid.module.scss';
import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';

/**
 * Template component used to render specific users modal
 *
 * @constructor
 */
const SpecificUsersModal = ({ postId, isOpen, setIsOpen, programId, setReloadPostsKey, notifyNewSpecificUsers }) => {
  const { formatMessage } = useIntl();
  const { my1, displayFlex, ml1, mr1, pointer, height280: height } = coreStyle;
  const {
    search,
    setSearch,
    specificUsers,
    hasMore,
    isLoading,
    handleLoadMore,
    scrollRef,
    onSearch
  } = useSpecificUsersList(programId);

  const {
    selectedUsers,
    isNotifying,
    isLoadingSelectedUsers,
    hasError,
    onSelectUser,
    onRemoveUser,
    handleConfirmation,
    handleCancel
  } = useSpecificUsersSelection({ postId, setReloadPostsKey, notifyNewSpecificUsers, isOpen, setIsOpen });

  if (!programId) {
    setIsOpen(false);
    return null;
  }

  return (
    <FlexibleModalContainer closeModal={() => setIsOpen(true)} isModalOpen={isOpen}>
      <div>
        <div className={`${grid['col-sm-4']} ${displayFlex}`}>
          <input
            placeholder={formatMessage({ id: 'wall.posts.confidentiality.selectUsers.search.placeholder' })}
            value={search}
            max={INPUT_LENGTH.MAX}
            onChange={({ target }) => setSearch(target.value)}
          />
          <span className={`${ml1} ${pointer}`}>
            <FontAwesomeIcon icon={faSearch} onClick={onSearch} />
          </span>
        </div>

        <HeadingAtom size="4" textId="wall.posts.confidentiality.selectUsers" />
        {isLoading && <Loading type={LOADER_TYPE.DROPZONE} />}
        {!isLoading && (
          <>
            <GenericInfiniteScroll
              {...{
                hasMore,
                loadMore: handleLoadMore,
                scrollRef,
                isLoading,
                height
              }}
            >
              <SpecificUsersCheckbox {...{ onSelectUser, onRemoveUser, specificUsers, selectedUsers }} />
            </GenericInfiniteScroll>
            {isLoadingSelectedUsers && <Loading type={LOADER_TYPE.DROPZONE} />}
            {!isLoadingSelectedUsers && (
              <DynamicFormattedMessage
                tag={HTML_TAGS.SPAN}
                id="wall.posts.confidentiality.selectUsers.selected"
                values={{ value: selectedUsers.length }}
              />
            )}
            <DynamicFormattedError hasError={hasError} id="wall.posts.confidentiality.selectUsers.validation.min" />
            <div>
              <DynamicFormattedMessage
                tag={Button}
                id={'wall.posts.confidentiality.confirm'}
                loading={isLoadingSelectedUsers || isNotifying}
                onClick={handleConfirmation}
                className={`${my1} ${mr1}`}
              />
              <DynamicFormattedMessage
                onClick={handleCancel}
                tag={Button}
                type={BUTTON_MAIN_TYPE.DANGER}
                id={'wall.posts.confidentiality.cancel'}
                className={`${my1} ${ml1}`}
              />
            </div>
          </>
        )}
      </div>
    </FlexibleModalContainer>
  );
};

export default SpecificUsersModal;
