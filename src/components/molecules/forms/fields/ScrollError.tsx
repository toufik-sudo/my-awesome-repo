import { connect } from 'formik';
import { Component } from 'react';
import { IFormikProps } from 'interfaces/forms/IForm';

/**
 * Class that takes error object and gets in focus the first element that has an error
 */
class ErrorFocusInternal extends Component<IFormikProps> {
  componentDidUpdate(prevProps: IFormikProps) {
    const { isSubmitting, isValidating, errors } = prevProps.formik;
    const keys = Object.keys(errors);

    if (keys.length > 0 && isSubmitting && !isValidating) {
      const selector = `[name="${keys[0]}"]`;
      const errorElement = document.querySelector(selector) as HTMLElement;

      if (errorElement) {
        errorElement.focus();
      }
    }
  }

  render = () => null;
}

export const ErrorFocus = connect<{}>(ErrorFocusInternal);
