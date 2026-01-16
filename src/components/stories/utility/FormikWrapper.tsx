import React from 'react';
import { Formik } from 'formik';
import { useDispatch } from 'react-redux';

import { contactLogsSubmitAction } from 'store/actions/formActions';
import { getInitialValues, processTailoredForm } from 'services/FormServices';

/**
 * Wrapper component used as a helper to render formik dependent stories
 *
 * @param children
 * @param formDeclaration
 * @constructor
 */
const FormikWrapper = ({ children, formDeclaration }) => {
  const dispatch = useDispatch();

  return (
    <Formik
      onSubmit={(values, props) => contactLogsSubmitAction(processTailoredForm(values), props, dispatch)}
      initialValues={getInitialValues<any>(formDeclaration)}
    >
      {props => children({ ...props })}
    </Formik>
  );
};

export default FormikWrapper;
