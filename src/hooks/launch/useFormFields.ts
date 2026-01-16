import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { getFormFields } from 'store/actions/formActions';
import { IStore } from 'interfaces/store/IStore';
import { getDefaultUserFields, getStoredUserFields, redirectToFirstStep } from 'services/LaunchServices';
import { COMING_SOON_FIELD, FREEMIUM, FULL } from 'constants/wall/launch';

/**
 * Hook used for retrieving Form Fields
 */
export const useFormFields = (platformType, formFieldsKey) => {
  const [formData, setFormData] = useState([]);
  const [selectedFields, setSelectedFields] = useState([]);
  const launchStore = useSelector((store: IStore) => store.launchReducer);
  const { programJourney, type, personaliseProducts } = launchStore;

  if (!programJourney || !type) redirectToFirstStep();

  async function caller() {
    let { data } = await getFormFields(
      programJourney,
      type === FREEMIUM ? 'socialWall' : type, //Freemium DB form fields can be found under socialWall key
      platformType,
      personaliseProducts ? 1 : 0
    );
    data = getStoredUserFields(data, launchStore[formFieldsKey]);
    setSelectedFields(getDefaultUserFields(data));
    let appliedFormData = data;

    if (programJourney === FULL) {
      appliedFormData = [...data, { key: `${type}.${COMING_SOON_FIELD}` }];
    }

    setFormData(appliedFormData);
  }

  useEffect(() => {
    caller();
  }, []);

  return { formData, selectedFields, setSelectedFields };
};
