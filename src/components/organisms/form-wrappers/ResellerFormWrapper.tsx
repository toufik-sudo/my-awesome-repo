import React from 'react';
import { Formik } from 'formik';
import { useDispatch } from 'react-redux';

import ResellerForm from 'components/molecules/forms/ResellerForm';
import ButtonClose from 'components/atoms/ui/ButtonClose';
import { ResellerSchema } from 'config/validationSchemas';
import { RESELLER_FORM_FIELDS } from 'constants/formDefinitions/formDeclarations';
import { RESELLER_MODAL } from 'constants/modal';
import { IResellerForm } from 'interfaces/IModals';
import { getInitialValues, processResellerForm } from 'services/FormServices';
import { contactLogsSubmitAction } from 'store/actions/formActions';

/**
 * Reseller template component that renders a formik form
 *
 * @param intl
 * @param closeModal
 * @constructor
 */
const ResellerFormWrapper = ({ onClick: closeModal }) => {
  const dispatch = useDispatch();

  return (
    <>
      <ButtonClose {...{ closeModal }} />
      <Formik
        enableReinitialize
        initialValues={getInitialValues<IResellerForm>(RESELLER_FORM_FIELDS)}
        validationSchema={ResellerSchema}
        onSubmit={(values, props) =>
          contactLogsSubmitAction(processResellerForm(values), props, dispatch, RESELLER_MODAL)
        }
      >
        {form => <ResellerForm {...{ form }} />}
      </Formik>
    </>
  );
};

export default ResellerFormWrapper;
