import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';

import { useValidityDropdownOptions } from 'hooks/launch/cube/validity/useValidityDropdownOptions';
import { useValidityPointsValidation } from 'hooks/launch/cube/validity/useValidityPointsValidation';
import { IStore } from 'interfaces/store/IStore';
import { getInitialValidityPoints, translateValidityPoints } from 'services/CubeServices';

/**
 * Hook used to handle validity points data
 */
export const useValidityPoints = () => {
  const { formatMessage, locale } = useIntl();
  const initialSelection = getInitialValidityPoints(formatMessage);
  const { cube } = useSelector((store: IStore) => store.launchReducer);
  const { allValidityPointsOptions } = useValidityDropdownOptions();
  const [selectedValidityPoints, setValidityPoints] = useState(initialSelection);
  const {
    handleValidityValidation,
    validateShouldDisplay,
    modifyShouldDisplay,
    sectionShouldDisplay,
    validityPointsValidated
  } = useValidityPointsValidation(selectedValidityPoints);

  useEffect(() => {
    let value = selectedValidityPoints.value;
    if (selectedValidityPoints.value !== cube.validityPoints.value) {
      value = cube.validityPoints.value;
    }

    setValidityPoints(translateValidityPoints(formatMessage, value));
  }, [cube, locale]);

  return {
    selectedValidityPoints,
    setValidityPoints,
    allValidityPointsOptions,
    handleValidityValidation,
    validateShouldDisplay,
    modifyShouldDisplay,
    sectionShouldDisplay,
    validityPointsValidated
  };
};
