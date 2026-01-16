import React from 'react';
import AsyncSelect from 'react-select/async';
import { useIntl, FormattedMessage } from 'react-intl';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCheck } from '@fortawesome/free-solid-svg-icons';

import style from 'assets/style/common/Input.module.scss';
import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';

/**
 * Molecule component used to render users dropdown input field
 *
 * @param field
 * @param onUserChange
 * @param loadUsers
 * @param error
 * @constructor
 *
 */
const UserAsyncSelector = ({ field, loadUsers, onUserChange, error = undefined }) => {
  const intl = useIntl();
  const { defaultInputStyle, errorRelative: errorStyle } = style;
  const {
    displayFlex,
    flexSpace1,
    flexSpace05,
    flexSpace8,
    mt1,
    withPrimaryColorHover,
    withGrayAccentColor
  } = coreStyle;

  return (
    <div>
      <div className={`${displayFlex} ${mt1}`}>
        <div className={`${displayFlex} ${flexSpace05}  ${coreStyle['flex-center-vertical']}`}>
          <FontAwesomeIcon
            icon={faUserCheck}
            className={`${flexSpace1} ${withPrimaryColorHover} ${withGrayAccentColor}`}
          />
          <AsyncSelect
            name={field.label}
            placeholder={intl.formatMessage({ id: `form.placeholder.${field.label}` })}
            onChange={onUserChange}
            isSearchable={true}
            className={`${defaultInputStyle} ${flexSpace8} ${mt1}`}
            loadOptions={loadUsers}
            defaultOptions
            cacheOptions
            getOptionLabel={(option: any) => `${option.firstName || ''} ${option.lastName || ''} - ${option.email}`}
            getOptionValue={(option: any) => option.uuid}
            hideSelectedOptions={false}
            isClearable={false}
          />
        </div>
      </div>
      {error && (
        <div className={errorStyle}>
          <FormattedMessage id={`form.validation.${error}`} />
        </div>
      )}
    </div>
  );
};

export default UserAsyncSelector;
