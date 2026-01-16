import React, { useCallback } from 'react';
import ReactTooltip from 'react-tooltip';
import { useHistory } from 'react-router-dom';
import { useIntl } from 'react-intl';

import UserListHeaderElement from 'components/molecules/communication/ListHeaderElement';
import Button from 'components/atoms/ui/Button';
import UsersListsItems from 'components/organisms/communication/UsersListItems';
import ConfirmationModal from 'components/organisms/modals/ConfirmationModal';
import { useUserLists } from 'hooks/communication/useUserLists';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import {
  WALL_COMMUNICATION_USER_LIST_ROUTE,
  VIEW_MODE,
  COMMUNICATION_FORM_CREATE_USER_LIST_ROUTE
} from 'constants/routes';
import { BUTTON_MAIN_TYPE } from 'constants/ui';
import { TOOLTIP_FIELDS } from 'constants/tootltip';

import componentStyle from 'sass-boilerplate/stylesheets/components/communication/Communication.module.scss';
import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';
import tableStyle from 'sass-boilerplate/stylesheets/components/tables/Table.module.scss';

/**
 * Organism component used to render list tab
 *
 * @constructor
 */
const UserLists = () => {
  const { campaignContainer, campaign } = componentStyle;
  const { mt5, textCenter } = coreStyle;
  const history = useHistory();
  const intl = useIntl();
  const {
    areAllProgramsSelected,
    isLoading,
    sortingFilter,
    setSortingFilter,
    userLists,
    hasNoUserLists,
    onDeleteUserList,
    openDeleteUserListModal
  } = useUserLists();

  const onEditUser = useCallback(
    uuid => {
      history.push(`${WALL_COMMUNICATION_USER_LIST_ROUTE}/${VIEW_MODE.EDIT}/${uuid}`);
    },
    [history]
  );

  return (
    <div className={campaign}>
      <ConfirmationModal onAccept={onDeleteUserList} />
      <div className={campaignContainer}>
        <div className={tableStyle.tableLg}>
          <UserListHeaderElement {...{ isLoading, sortingFilter, setSortingFilter }} />
          <UsersListsItems
            {...{
              isLoading,
              hasNoUserLists,
              userLists,
              openDeleteUserListModal,
              onEditUser,
              canEdit: !areAllProgramsSelected
            }}
          />
        </div>
      </div>
      <div
        className={`${textCenter} ${mt5}`}
        data-tip={intl.formatMessage({ id: 'communication.specificProgram.notSelected' })}
      >
        <DynamicFormattedMessage
          disabled={areAllProgramsSelected}
          type={areAllProgramsSelected ? BUTTON_MAIN_TYPE.DISABLED : BUTTON_MAIN_TYPE.PRIMARY}
          onClick={() => !areAllProgramsSelected && history.push(COMMUNICATION_FORM_CREATE_USER_LIST_ROUTE)}
          tag={Button}
          id="communication.list.create.cta"
        />
      </div>
      {areAllProgramsSelected && (
        <ReactTooltip
          place={TOOLTIP_FIELDS.PLACE_BOTTOM}
          type={TOOLTIP_FIELDS.TYPE_ERROR}
          effect={TOOLTIP_FIELDS.EFFECT_SOLID}
        />
      )}
    </div>
  );
};

export default UserLists;
