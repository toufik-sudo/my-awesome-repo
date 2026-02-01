// -----------------------------------------------------------------------------
// useProgramDetailsForPdfCreation Hook
// Migrated from old_app/src/hooks/pdf/useProgramDetailsForPdfCreation.ts
// -----------------------------------------------------------------------------

import { format } from 'date-fns';
import { FULL } from '@/constants/wall/launch';

interface ILaunchData {
  programName?: string;
  programJourney?: string;
  companyName?: string;
  duration?: {
    start?: Date | string;
    end?: Date | string;
  };
  programBudget?: number | string;
}

interface IUserData {
  companyName?: string;
  city?: string;
  country?: string;
}

interface IProgramDetails {
  dateNow: string;
  programName: string;
  companyName: string;
  programStartingDate: string;
  programEndingDate: string;
  programBudget: string;
  stateAndCountry: string;
}

/**
 * Format date as ISO string (YYYY-MM-DD)
 */
const formatDateAsIso = (): string => format(new Date(), 'yyyy-MM-dd');

/**
 * Format date to specified format
 */
const formatDate = (date: Date | string, formatStr: string): string => {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return format(dateObj, formatStr.replace('Y', 'yyyy'));
  } catch {
    return formatDateAsIso();
  }
};

/**
 * Hook used to create program details for dynamic pdf creation
 */
export const useProgramDetailsForPdfCreation = (
  launchData: ILaunchData | null,
  userData: IUserData | null
): IProgramDetails => {
  if (!launchData || !userData) {
    return {
      dateNow: formatDateAsIso(),
      programName: '',
      companyName: '',
      programStartingDate: '',
      programEndingDate: '',
      programBudget: '0€',
      stateAndCountry: 'your country'
    };
  }

  const programName = launchData.programName || '';
  const companyName =
    (launchData.programJourney === FULL && launchData.companyName) || userData.companyName || '';
  
  const programStartingDate =
    launchData.duration?.start
      ? formatDate(launchData.duration.start, 'yyyy-MM-dd')
      : formatDateAsIso();
  
  const programEndingDate =
    launchData.duration?.end
      ? formatDate(launchData.duration.end, 'yyyy-MM-dd')
      : formatDateAsIso();
  
  const programBudget = launchData.programBudget ? `${launchData.programBudget}€` : '0€';
  
  const stateAndCountry =
    userData.city && userData.country
      ? `${userData.city}/${userData.country}`
      : userData.city
      ? `${userData.city}`
      : userData.country
      ? `${userData.country}`
      : 'your country';

  return {
    dateNow: formatDateAsIso(),
    programName,
    companyName,
    programStartingDate,
    programEndingDate,
    programBudget,
    stateAndCountry
  };
};

export default useProgramDetailsForPdfCreation;
