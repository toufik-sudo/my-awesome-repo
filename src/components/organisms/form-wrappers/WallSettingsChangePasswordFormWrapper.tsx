import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { useDispatch } from 'react-redux';
import { useIntl } from 'react-intl';

import ChangePasswordFormAdditional from 'components/molecules/forms/ChangePasswordAdditional';
import GenericFormBuilder from 'components/organisms/form-wrappers/GenericFormBuilder';
import { CHANGE_PASSWORD_FORM_FIELDS } from 'constants/formDefinitions/formDeclarations';
import { changePasswordSubmitAction } from 'store/actions/formActions';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { HTML_TAGS } from 'constants/general';

import style from 'sass-boilerplate/stylesheets/components/wall/WallSettingsBlock.module.scss';

/**
 * Organism component that renders a change password form
 *
 * @constructor
 */
const WallSettingsChangePasswordFormWrapper = () => {
  const [formLoading, setFormLoading] = useState(false);
  const history = useHistory();
  const { formatMessage } = useIntl();
  const dispatch = useDispatch();

  return (
    <div className={style.settingsChangePassword}>
      <DynamicFormattedMessage
        tag={HTML_TAGS.DIV}
        id={'wall.settings.change.account.password'}
        className={style.settingsChangePasswordTitle}
      />
      <GenericFormBuilder
        formAction={(values, props) =>
          changePasswordSubmitAction({ ...values }, props, history, setFormLoading, dispatch, formatMessage)
        }
        formDeclaration={CHANGE_PASSWORD_FORM_FIELDS}
        formSlot={form => <ChangePasswordFormAdditional {...{ form, formLoading }} />}
      />
    </div>
  );
};

export default WallSettingsChangePasswordFormWrapper;
