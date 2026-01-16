import { FULL } from 'constants/general';
import MomentUtilities from 'utils/MomentUtilities';

/**
 * Hook used to create program details for dynamic pdf creation
 *
 * @param launchData
 * @param userData
 */
export const useProgramDetailsForPdfCreation = (launchData, userData) => {
  if (!launchData || !userData) {
    return {
      dateNow: MomentUtilities.formatDateAsIso()
    };
  }

  const programName = launchData && launchData.programName ? launchData.programName : '';
  const companyName =
    (launchData && launchData.programJourney == FULL && launchData.companyName) || userData.companyName;
  const programStartingDate =
    launchData && launchData.duration && launchData.duration.start
      ? MomentUtilities.formatDate(launchData.duration.start, 'Y-MM-DD')
      : MomentUtilities.formatDateAsIso();
  const programEndingDate =
    launchData && launchData.duration && launchData.duration.end
      ? MomentUtilities.formatDate(launchData.duration.end, 'Y-MM-DD')
      : MomentUtilities.formatDateAsIso();
  const programBudget = launchData && launchData.programBudget ? `${launchData.programBudget}€` : '0€';
  const stateAndCountry =
    userData && userData.city && userData.country
      ? `${userData.city}/${userData.country}`
      : userData && userData.city
      ? `${userData.city}`
      : userData && userData.country
      ? `${userData.country}`
      : 'your country';

  return {
    dateNow: MomentUtilities.formatDateAsIso(),
    programName,
    companyName,
    programStartingDate,
    programEndingDate,
    programBudget,
    stateAndCountry
  };
};
