import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';

import UserListSearchInput from './UserListSearchInput';
import Button from 'components/atoms/ui/Button';
import UsersList from 'components/organisms/communication/UsersList';
import UsersListHeaderElement from 'components/molecules/communication/UsersListHeaderElement';
import useLoadUserList from 'hooks/communication/useLoadUserList';
import useUserListForm from 'hooks/communication/useUserListForm';
import useOnLoadEditableUserList from 'hooks/communication/useOnLoadEditableList';
import Loading from 'components/atoms/ui/Loading';
import useLockProgramSelection from 'hooks/general/useLockProgramSelection';
import DynamicFormattedError from 'components/atoms/ui/DynamicFormattedError';
import { LOADER_TYPE } from 'constants/general';
import { BUTTON_MAIN_TYPE, BUTTON_MAIN_VARIANT } from 'constants/ui';
import { IStore } from 'interfaces/store/IStore';
import { VIEW_MODE } from 'constants/routes';
import { useSelectedProgramDesign } from 'hooks/wall/ui/useSelectedProgramColors';

import componentStyle from 'sass-boilerplate/stylesheets/components/communication/CreateCampaignList.module.scss';
import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';
import tableStyle from 'sass-boilerplate/stylesheets/components/tables/Table.module.scss';
import inputStyle from 'assets/style/common/Input.module.scss';

/**
 * Page component used to render create campaign page
 *
 * @param match
 * @constructor
 */
const UserListFormPage = ({ match: { params } }) => {
  const {
    mt1,
    mb5,
    pt5,
    pb1,
    py3,
    px7,
    textCenter,
    withPrimaryColor,
    px5,
    mLargePx1,
    mLargePx0,
    withBackgroundDefault
  } = coreStyle;
  const { createCampaign } = componentStyle;
  const { defaultInputStyle, container } = inputStyle;
  const { formatMessage } = useIntl();
  const programId = useSelector<IStore, number | undefined>(store => store.wallReducer.selectedProgramId);
  const [forcedEditProgramId, setForcedEditProgramId] = useState(null);
  const currentEditableUserListId =
    (params[VIEW_MODE.PARAM] === VIEW_MODE.EDIT && params[VIEW_MODE.CURRENT_ID]) || null;

  const {
    isLoading,
    hasMore,
    sortingFilter,
    setSortingFilter,
    users,
    loadMore,
    scrollRef,
    searchValue,
    applySearchFilter,
    setSearchValue
  } = useLoadUserList({ programId, currentEditableUserListId, forcedEditProgramId });

  const {
    onSaveUserList,
    userListName,
    isSaving,
    selectedUserIds,
    errors,
    setUserListName,
    setSelectedUserIds,
    toggleUserSelected
  } = useUserListForm({ programId, users, currentEditableUserListId });

  useOnLoadEditableUserList({
    currentEditableUserListId,
    setForcedEditProgramId,
    setSelectedUserIds,
    setUserListName
  });

  useLockProgramSelection();

  const canSaveUserList = programId && !isLoading;
  const saveCTALabelId = `communication.userList.${currentEditableUserListId ? 'edit.save' : 'create.continue'}`;
  const titleId = `communication.userList.${currentEditableUserListId ? 'edit' : 'create'}.list.title`;
  const { tableMd, table, tableScrollable } = tableStyle;
  const { colorMainButtons } = useSelectedProgramDesign();

  return (
    <div className={`${createCampaign} ${withBackgroundDefault} ${pb1} ${mb5} ${table}`}>
      <UserListSearchInput
        value={searchValue}
        titleId={titleId}
        onChange={({ target }) => setSearchValue(target.value)}
        onSearch={applySearchFilter}
      />
      <div className={`${tableScrollable} ${mLargePx0} ${px5}`}>
        <div className={`${py3} ${px7} ${mLargePx1}`}>
          <div className={container}>
            <input
              className={defaultInputStyle}
              value={userListName}
              placeholder={formatMessage({ id: 'communication.userList.create.name.placeholder' })}
              onChange={({ target }) => setUserListName(target.value)}
            />
          </div>
          <DynamicFormattedError hasError={errors.name} id={errors.name} />
        </div>
        <div className={`${table} ${tableScrollable}`}>
          <div className={tableMd}>
            <UsersListHeaderElement {...{ sortingFilter, setSortingFilter, isLoading }} />
            <UsersList
              {...{
                loadMore,
                scrollRef,
                hasMore,
                users,
                selectedUserIds,
                toggleUserSelected,
                isLoading,
                programId
              }}
            />
          </div>
        </div>
        <div>
          <div className={`${textCenter} ${pt5} ${withPrimaryColor}`}>
            {formatMessage({ id: 'communication.userList.create.selectedEmails' }, { value: selectedUserIds.length })}
          </div>
          <DynamicFormattedError hasError={errors.users} id={errors.users} />
        </div>
        <div className={`${textCenter} ${mt1} ${mb5}`}>
          <Button
            disabled={!canSaveUserList}
            variant={canSaveUserList ? BUTTON_MAIN_VARIANT.INVERTED : BUTTON_MAIN_TYPE.DISABLED}
            onClick={() => canSaveUserList && onSaveUserList()}
            customStyle={{ borderColor: colorMainButtons, color: colorMainButtons }}
          >
            {(isSaving && <Loading type={LOADER_TYPE.DROPZONE} />) || formatMessage({ id: saveCTALabelId })}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserListFormPage;
