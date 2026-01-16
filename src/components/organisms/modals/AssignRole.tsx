import React from 'react';

import FlexibleModalContainer from 'containers/FlexibleModalContainer';
import SelectUserType from 'components/molecules/wall/settings/SelectUserType';
import Button from 'components/atoms/ui/Button';
import TextInput from 'components/atoms/ui/TextInput';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { HTML_TAGS } from 'constants/general';
import { BUTTON_MAIN_TYPE } from 'constants/ui';

import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';
import inputStyle from 'assets/style/common/Input.module.scss';

/**
 * Organism component used to render add new user modal
 * @param showModal
 * @param closeModal
 * @param selectedType
 * @param email
 * @param setEmail
 * @constructor
 */
const AssignRole = ({
  editingId,
  onValidate,
  error,
  showModal,
  isSubmitting,
  closeModal,
  platformHierarchicType,
  selectedRole,
  setSelectedRole,
  email,
  initialSelectedRole,
  setEmail
}) => {
  const { withBoldFont, displayFlex, mt2, mb2, textLeft, mt1, bfVisibilityHidden } = coreStyle;

  return (
    <FlexibleModalContainer
      className={`${displayFlex} ${coreStyle['flex-direction-column']}`}
      isModalOpen={showModal}
      closeModal={closeModal}
    >
      <div className={`${displayFlex} ${coreStyle['flex-direction-column']} ${mb2} ${bfVisibilityHidden}`}>
        <DynamicFormattedMessage
          className={`${withBoldFont} ${mb2}`}
          tag={HTML_TAGS.P}
          id={`wall.settings.administrators.${editingId ? 'editRole' : 'assignRole'}`}
        />
        <SelectUserType
          {...{
            platformHierarchicType,
            selectedRole,
            setSelectedRole
          }}
        />
        {!editingId && (
          <div className={`${inputStyle.container} ${textLeft}`}>
            <TextInput
              value={email}
              disabled={editingId}
              onChange={e => setEmail(e.target.value)}
              inputClass={inputStyle.defaultInputStyle}
              error={error}
            />
            <DynamicFormattedMessage tag={HTML_TAGS.LABEL} className="inputLabel" id="form.label.email" />
          </div>
        )}
        <DynamicFormattedMessage
          loading={isSubmitting}
          disabled={isSubmitting || initialSelectedRole === selectedRole}
          tag={Button}
          type={
            isSubmitting || initialSelectedRole === selectedRole ? BUTTON_MAIN_TYPE.DISABLED : BUTTON_MAIN_TYPE.PRIMARY
          }
          className={mt2}
          id="launchProgram.cube.validate"
          onClick={onValidate}
        />
        <DynamicFormattedMessage
          tag={Button}
          type={BUTTON_MAIN_TYPE.DANGER}
          className={mt1}
          onClick={closeModal}
          id="label.close.modal"
        />
      </div>
    </FlexibleModalContainer>
  );
};

export default AssignRole;
