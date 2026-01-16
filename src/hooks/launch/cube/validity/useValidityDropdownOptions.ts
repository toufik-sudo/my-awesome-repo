import { useIntl } from 'react-intl';

import { getTimeValidityOptions } from 'services/CubeServices';
import { TIME_DROPDOWN_OPTIONS, VALIDITY_MONTHS_COUNT, VALIDITY_WEEKS_COUNT } from 'constants/wall/launch';

/**
 * Hook used to handle validity options dorpdown options
 */
export const useValidityDropdownOptions = () => {
  const { formatMessage } = useIntl();
  const yearOptions = {
    value: `1${TIME_DROPDOWN_OPTIONS.YEAR.VALUE}`,
    label: `${formatMessage({ id: `launchProgram.cube.validity.${TIME_DROPDOWN_OPTIONS.YEAR.LABEL}` }, { value: 1 })}`
  };
  const monthsOptions = getTimeValidityOptions(formatMessage, VALIDITY_MONTHS_COUNT, {
    value: TIME_DROPDOWN_OPTIONS.MONTH.VALUE,
    id: TIME_DROPDOWN_OPTIONS.MONTH.LABEL
  }).reverse();
  const weeksOptions = getTimeValidityOptions(formatMessage, VALIDITY_WEEKS_COUNT, {
    value: TIME_DROPDOWN_OPTIONS.WEEK.VALUE,
    id: TIME_DROPDOWN_OPTIONS.WEEK.LABEL
  }).reverse();
  const allValidityPointsOptions = [yearOptions, ...monthsOptions, ...weeksOptions];

  return { allValidityPointsOptions };
};
