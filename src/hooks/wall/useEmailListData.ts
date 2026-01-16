import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { setLinkedEmailsData } from 'store/actions/wallActions';
import { getErrorId } from 'utils/validationUtils';

/**
 * Hook used to manage email list chips
 * @param userEmail
 * @param userData
 */
export const useEmailListData = (userEmail, userData) => {
  const [emails, setEmails] = useState([]);
  const [email, setEmail] = useState('');
  const [isEmailsLoading, setEmailsLoading] = useState(false);
  const [error, setError] = useState('');
  const dispatch = useDispatch();

  const addEmail = () => {
    setEmailsLoading(true);
    const newEmails = emails;
    const emailError = getErrorId(newEmails, email, userEmail);
    const isValidEmail = !emailError.length;

    if (!error.length) {
      setError(emailError);
    }
    if (isValidEmail) {
      newEmails.push(email.trim());
      setError('');
      dispatch(setLinkedEmailsData([...newEmails]));
    }
    setEmails([...newEmails]);
    setEmail('');
  };

  useEffect(() => {
    const initialEmails = userData && userData.linkedEmails;
    if (initialEmails) {
      setEmails(initialEmails);
    }
  }, [userData]);

  const removeEmail = emailToDelete => {
    const newEmails = emails.filter(email => email !== emailToDelete);
    setEmails(newEmails);
    dispatch(setLinkedEmailsData(newEmails));
    setError('');
  };

  return { emails, setEmail, addEmail, removeEmail, email, isEmailsLoading, error };
};
