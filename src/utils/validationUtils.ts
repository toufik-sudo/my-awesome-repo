import { GLOBAL, API_VALIDATION_CODE_RANGE, MAX_EMAIL_LENGTH_LIST } from 'constants/validation';
import { hasValidEmailFormat } from 'utils/general';

/**
 * Sets the errors from response accordingly to the given response
 * @param props
 * @param fields
 * @param response
 */
export const handleApiFormValidation = (props, fields, response = { data: {} as any }) => {
  const { code, field } = response.data;
  if (!code) {
    return;
  }
  const fieldError = field && field in fields ? field : GLOBAL;
  const { MIN, MAX } = API_VALIDATION_CODE_RANGE;
  const errorMessage = code >= MIN && code <= MAX ? code : 'generic.error';
  props.setFieldError(fieldError, errorMessage);
};

/**
 * Method returns error message for email
 * @param newEmails
 * @param email
 * @param userEmail
 */
export const getErrorId = (newEmails, email, userEmail) => {
  const formattedEmail = email.toLowerCase().trim();
  let errorMessage = '';

  newEmails.forEach(item => {
    if (item.toLowerCase().trim() === formattedEmail) {
      errorMessage = 'invalid.email';
    }
  });

  if (!formattedEmail.length || !hasValidEmailFormat(email)) {
    errorMessage = 'email.not.valid';
  }

  if (formattedEmail === userEmail.toLowerCase().trim()) {
    errorMessage = 'invalid.email';
  }

  if (newEmails.length >= MAX_EMAIL_LENGTH_LIST) {
    errorMessage = 'maximum.emails.number';
  }

  return errorMessage;
};

/**
 * Validation of a given email to be required and also set error
 * @param email
 * @param setError
 */
export const isEmailValid = (email, setError) => {
  if (!email) {
    setError('form.validation.required');
    return false;
  }
  if (!hasValidEmailFormat(email)) {
    setError('form.validation.invalid.email');
    return false;
  }
  setError('');

  return true;
};
