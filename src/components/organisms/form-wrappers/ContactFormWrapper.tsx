import React from 'react';
import { useDispatch } from 'react-redux';
import { Formik } from 'formik';

import ContactForm from 'components/molecules/forms/ContactForm';
import { ContactSchema } from 'config/validationSchemas';
import { contactLogsSubmitAction } from 'store/actions/formActions';
import { CONTACT_FORM_FIELDS } from 'constants/formDefinitions/formDeclarations';
import { CONTACT_MAIN_MODAL } from 'constants/modal';
import { IContactMainForm } from 'interfaces/IModals';
import { getInitialValues, processContactMainForm } from 'services/FormServices';

import style from 'assets/style/components/ContactSection.module.scss';

/**
 * Organism component used to render contact main form
 *
 * @constructor
 */
const ContactFormWrapper = () => {
  const dispatch = useDispatch();

  return (
    <Formik
      onSubmit={(values, props) =>
        contactLogsSubmitAction(processContactMainForm(values), props, dispatch, CONTACT_MAIN_MODAL)
      }
      enableReinitialize
      initialValues={getInitialValues<IContactMainForm>(CONTACT_FORM_FIELDS)}
      validationSchema={ContactSchema}
    >
      {form => (
        <div className={style.formContainer}>
          <ContactForm {...{ form }} />
        </div>
      )}
    </Formik>
  );
};

export default ContactFormWrapper;
