import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { useIntl } from 'react-intl';
import Cookies from 'js-cookie';

import PersonalInformationFormAdditional from 'components/molecules/forms/PersonalInformationFormAdditional';
import GenericFormBuilder from 'components/organisms/form-wrappers/GenericFormBuilder';
import {
  PERSONAL_INFORMATION_ADMIN_FIELDS,
  PERSONAL_INFORMATION_FIELDS
} from 'constants/formDefinitions/formDeclarations';
import { submitPersonalInformation } from 'store/actions/formActions';
import { AvatarContext } from 'components/pages/PersonalInformationPage';
import { USER_DETAILS_COOKIE } from 'constants/general';
import { DISABLED, FLOATING, FORM_FIELDS, IS_HIDDEN } from 'constants/forms';
import {
  getUserAuthorizations,
  isAtLeastSuperAdmin,
  isAtLeastSuperCommunityManager
} from 'services/security/accessServices';
import { useUserData } from 'hooks/user/useUserData';

import styles from 'assets/style/components/PersonalInformation/PersonalInformation.module.scss';

/**
 * Template component used to display personal information form
 *
 * @constructor
 */
const PersonalInformationFormWrapper = () => {
  const history = useHistory();
  const [formLoading, setFormLoading] = useState(false);
  const [isMinimumSuperAdmin, setIsMinimumSuperAdmin] = useState(false);
  const [isExistingSuperAdminInvite, setIsExistingSuperAdminInvite] = useState(true);
  const [formDeclaration, setFormDeclaration] = useState([]);
  const { avatarData } = useContext(AvatarContext);
  const { formatMessage } = useIntl();
  const userDetails: any = JSON.parse(Cookies.get(USER_DETAILS_COOKIE));
  const { userData } = useUserData();
  // let formDeclaration = [];
  const setInitialFormFields = (form, userPlatform)=>{
    const roleField = form.map(field => {
      if(field.label === FORM_FIELDS.COMPANY_ROLE) {
        field.initialValue = formatMessage({ id: 'wall.users.role.' + userPlatform.role });
        field.style = { ...DISABLED, ...FLOATING };
      }
      if(userData && userData.uuid){
        
        if(field.label === FORM_FIELDS.TITLE && userData.title) {
          field.initialValue = userData.title;
          field.style = { ...DISABLED, ...FLOATING };
        }
        if(field.label === FORM_FIELDS.FIRST_NAME && userData.firstName) {
          field.initialValue = userData.firstName;
          field.style = { ...DISABLED, ...FLOATING };
        }
        if(field.label === FORM_FIELDS.LAST_NAME && userData.lastName) {
          field.initialValue = userData.lastName;
          field.style = { ...DISABLED, ...FLOATING };
        }
        if(field.label === FORM_FIELDS.PHONE_NUMBER && userData.phoneNumber) {
          field.initialValue = userData.phoneNumber;
          field.style = { ...DISABLED, ...FLOATING };
        }        
        if(field.label === FORM_FIELDS.MOBILE_PHONE_NUMBER && userData.mobilePhoneNumber) {
          field.initialValue = userData.mobilePhoneNumber;
          field.style = { ...DISABLED, ...FLOATING };
        }        
      }
    });
  }

  useEffect(() => {
    if (userData && userData.invitationsRoles && userData.invitationsRoles.length > 0) {
      const userPlatform = userData.invitationsRoles.find(role => role.platform === userDetails.invitedToPlatform);
      const userRole = getUserAuthorizations(userPlatform.role);
      const form = userDetails.invitedToPlatform && userRole.isSuperAdmin
        ? PERSONAL_INFORMATION_ADMIN_FIELDS
        : PERSONAL_INFORMATION_FIELDS;

      setFormDeclaration(form);  
  
      if (userDetails.invitedToPlatform && userData.invitationsRoles && userData.invitationsRoles.length > 0) {
        const isMinimumSuperAdminVar = isAtLeastSuperAdmin(userRole) || isAtLeastSuperCommunityManager(userRole);
        setIsMinimumSuperAdmin(isMinimumSuperAdminVar);
        setIsExistingSuperAdminInvite(userRole.isSuperAdmin && (userData.originalPicturePath || userData.croppedPicturePath));
  
        if (isMinimumSuperAdminVar) {
          setInitialFormFields(form, userPlatform);
        } else {
          const roleField = form.find(field => field.label === FORM_FIELDS.PLATFORM_IDENTIFIER);
          roleField.initialValue = userDetails.invitedToPlatform;
          roleField.style = { ...IS_HIDDEN, ...DISABLED, ...FLOATING };
        }
        const programIdField = form.find(field => field.label === FORM_FIELDS.PROGRAM_ID);
        if (programIdField){
          programIdField.style = { ...IS_HIDDEN, ...DISABLED, ...FLOATING };
        }
      }
      // setFormLoading(true);
    } else {
      // setFormLoading(true);
    }
  }, [userData])
  
  if(!(userData && userData.invitationsRoles && userData.invitationsRoles.length > 0)){
    return (<div></div>);
  }

  return (
    <div className={styles.wrapper}>
      <GenericFormBuilder
        formAction={(values, props) =>
          submitPersonalInformation(avatarData, values, props, setFormLoading, formatMessage, isExistingSuperAdminInvite)
        }
        formDeclaration={[...formDeclaration]}
        formSlot={form => (
          <PersonalInformationFormAdditional {...{ form, history, formLoading, isMinimumSuperAdmin, isExistingSuperAdminInvite }} />
        )}
      />
    </div>
  );
};

export default PersonalInformationFormWrapper;


