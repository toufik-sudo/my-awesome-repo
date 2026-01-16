import React from 'react';

import useAdministratorsRoles from 'hooks/wall/useAdministratorsRoles';
import WallSettingsAdministratorsHeader from 'components/molecules/wall/settings/WallSettingsAdministratorsHeader';
import WallSettingsAdministratorsRow from 'components/molecules/wall/settings/WallSettingsAdministratorsRow';
import Button from 'components/atoms/ui/Button';
import AssignRole from 'components/organisms/modals/AssignRole';
import ConfirmationModal from 'components/organisms/modals/ConfirmationModal';
import Loading from 'components/atoms/ui/Loading';
import useLoadAdministrators from 'hooks/wall/useLoadAdministrators';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { HTML_TAGS, LOADER_TYPE } from 'constants/general';
import { BUTTON_MAIN_TYPE } from 'constants/ui';
import { useLoggedUserUuid } from 'hooks/authorization/useLoggedUserUuid';

import style from 'sass-boilerplate/stylesheets/components/wall/WallSettingsTable.module.scss';
import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';
import tableStyle from 'sass-boilerplate/stylesheets/components/tables/Table.module.scss';

/**
 * Organism component used to render wall settings administrators tab
 * @constructor
 */
const WallSettingsAdministrators = ({ platform }) => {
  const {
    displayBlock,
    textCenter,
    mt4,
    mb3,
    withFontMedium,
    withBoldFont,
    py1,
    height40,
    withSecondaryColor
  } = coreStyle;
  const { table, tableContainer } = style;
  const { reloadAdministrators, isLoading, administrators, isAssignDisable } = useLoadAdministrators(platform);

  const {
    error,
    showModal,
    setShowModal,
    closeModal,
    selectedRole,
    setSelectedRole,
    email,
    openConfirmRemoveRole,
    onRemoveRole,
    openEditRole,
    initialSelectedRole,
    onValidate,
    editingId,
    isSubmitting,
    setEmail
  } = useAdministratorsRoles(platform, reloadAdministrators);
  const { loggedUserUuid } = useLoggedUserUuid();
  const assignIsDisabled = isAssignDisable || isLoading;

  return (
    <div>
      <div className={`${tableStyle.tableScrollable} ${tableStyle.table}`}>
        <div className={tableStyle.tableLg}>
          <WallSettingsAdministratorsHeader />
          <div className={table}>
            <div className={tableContainer}>
              <div className={height40}>
                {isLoading && <Loading type={LOADER_TYPE.DROPZONE} className={`${withSecondaryColor} ${mt4}`} />}
                {!isLoading &&
                  administrators.map((administrator, index) => (
                    <WallSettingsAdministratorsRow
                      key={index}
                      {...{
                        administrator,
                        openConfirmRemoveRole,
                        openEditRole,
                        platformHierarchicType: platform.hierarchicType,
                        currentUser: { role: platform.role, uuid: loggedUserUuid }
                      }}
                    />
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={`${displayBlock} ${textCenter} ${mt4} ${mb3}`}>
        <DynamicFormattedMessage
          type={assignIsDisabled ? BUTTON_MAIN_TYPE.DISABLED : BUTTON_MAIN_TYPE.SECONDARY}
          onClick={() => setShowModal(true)}
          disabled={assignIsDisabled}
          tag={Button}
          id="wall.settings.administrators.assignRole"
        />
      </div>
      <DynamicFormattedMessage
        tag={HTML_TAGS.P}
        id="wall.settings.administrators.info.firstBody"
        className={withFontMedium}
      />
      <DynamicFormattedMessage
        tag={HTML_TAGS.P}
        id="wall.settings.administrators.info.secondBody"
        className={withFontMedium}
      />
      <p className={py1}>
        <DynamicFormattedMessage
          tag={HTML_TAGS.SPAN}
          id="wall.settings.administrators.info.admin"
          className={`${withFontMedium} ${withBoldFont}`}
        />
        <DynamicFormattedMessage tag={HTML_TAGS.SPAN} id="settings.administrators.info.all" />
      </p>
      <AssignRole
        {...{
          onValidate,
          error,
          editingId,
          closeModal,
          showModal,
          setEmail,
          setSelectedRole,
          initialSelectedRole,
          email,
          isSubmitting,
          selectedRole,
          platformHierarchicType: platform.hierarchicType
        }}
      />
      <ConfirmationModal onAccept={onRemoveRole} question="confirmation.label.remove.role.question" />
    </div>
  );
};

export default WallSettingsAdministrators;
