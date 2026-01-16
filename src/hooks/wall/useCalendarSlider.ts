import { useState } from 'react';

import { generateNextDates, generatePreviousDates, initializeDates } from 'services/AgendaServices';

/**
 * Hook used to navigate through dates in agenda.
 * @param initialDate
 * @param minDate
 * @param onDateChange
 */
const useCalendarSlider = (initialDate: Date, minDate: Date, onDateChange) => {
  const [days, setDays] = useState(initializeDates(initialDate, minDate));

  const beforeDateChange = (oldIndex, newIndex) => {
    if (oldIndex === newIndex) {
      return;
    }

    const isForwardMove = newIndex > oldIndex;
    const daysToDisplay = isForwardMove ? generateNextDates(days) : generatePreviousDates(days, minDate);

    setDays(daysToDisplay);
    onDateChange(daysToDisplay.current, isForwardMove);
  };

  const currentDisplay = {
    selectedIndex: days.previous ? 1 : 0,
    days: days.previous ? [days.previous, days.current, days.next] : [days.current, days.next]
  };

  return {
    beforeDateChange,
    ...currentDisplay
  };
};

export default useCalendarSlider;
