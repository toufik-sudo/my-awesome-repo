import React, { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Formik } from 'formik';
import { toast } from 'react-toastify';
import { useIntl } from 'react-intl';

import CreateAccountForm from 'components/molecules/forms/CreateAccountForm';
import CreateAccountFormAdditional from 'components/molecules/forms/CreateAccountFormAdditional';
import { CREATE_ACCOUNT_FIELDS } from 'constants/formDefinitions/formDeclarations';
import { ICreateAccountForm } from 'interfaces/IModals';
import { CreateAccountSchema } from 'config/validationSchemas';
import { getInitialValues } from 'services/FormServices';
import { createAccountSubmitAction } from 'store/actions/formActions';
import { DUPLICATED_VALUE } from 'constants/forms';
import { LOGIN_PAGE_ROUTE } from 'constants/routes';
import { handleApiFormValidation } from 'utils/validationUtils';
import { getLocalStorage } from 'services/StorageServies';
import { INVITED_ADMIN_PLATFORM } from 'constants/general';

import style from 'assets/style/components/CreateAccountLogin.module.scss';

/**
 * Organism component that renders a create account form with a left side layout
 *
 * @constructor
 */
const CreateAccountFormWrapper = () => {
  const history = useHistory();
  const params: any = useParams();
  const [formLoading, setFormLoading] = useState(false);
  const { formatMessage } = useIntl();
  const handleError = (props, values, err) => {
    const platformId = getLocalStorage(INVITED_ADMIN_PLATFORM);
    if (platformId && err.response && err.response.data && err.response.data.code === DUPLICATED_VALUE) {
      toast(formatMessage({ id: 'toast.inviteAdmin.existing.account' }));
      return history.push(LOGIN_PAGE_ROUTE);
    }
    handleApiFormValidation(props, values, err.response);
  };

  return (
    <Formik
      onSubmit={(values, props) =>
        createAccountSubmitAction(values, props, history, params, setFormLoading, handleError)
      }
      enableReinitialize
      initialValues={getInitialValues<ICreateAccountForm>(CREATE_ACCOUNT_FIELDS)}
      validationSchema={CreateAccountSchema}
    >
      {form => (
        <div className={style.container}>
          <CreateAccountForm {...{ form, formLoading }} />
          <CreateAccountFormAdditional />
        </div>
      )}
    </Formik>
  );
};

export default CreateAccountFormWrapper;
