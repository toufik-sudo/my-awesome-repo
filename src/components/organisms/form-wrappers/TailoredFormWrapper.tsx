import React from 'react';
import { Formik } from 'formik';
import { useDispatch } from 'react-redux';

import { TAILORED_FORM_FIELDS } from 'constants/formDefinitions/formDeclarations';
import { ITailoredForm } from 'interfaces/IModals';
import { TailoredSchema } from 'config/validationSchemas';
import { getInitialValues, processTailoredForm } from 'services/FormServices';
import { contactLogsSubmitAction } from 'store/actions/formActions';
import style from 'assets/style/components/tailored/TailoredForm.module.scss';
import styles from 'assets/style/common/Input.module.scss';
import TailoredForm from 'components/molecules/forms/TailoredForm';

/**
 * Organism component used to render tailored form
 *
 * @constructor
 */
const TailoredFormWrapper = () => {
  const dispatch = useDispatch();

  return (
    <div className={`${style.container} ${styles.tailoredInput}`}>
      <Formik
        onSubmit={(values, props) => contactLogsSubmitAction(processTailoredForm(values), props, dispatch)}
        initialValues={getInitialValues<ITailoredForm>(TAILORED_FORM_FIELDS)}
        validationSchema={TailoredSchema}
      >
        {form => <TailoredForm {...{ form }} />}
      </Formik>
    </div>
  );
};

export default TailoredFormWrapper;
