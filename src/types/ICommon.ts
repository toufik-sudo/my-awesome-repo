/**
 * Navigation scroll element props
 */
export interface INavScrollElementProps {
  title: string;
  id?: string;
  style?: string;
  setActive?: () => void;
  offsetHeight?: number;
  styleCustom?: string;
  closeNav?: () => void;
}

/**
 * Period interface for date ranges
 */
export interface IPeriod {
  startDate: Date;
  endDate: Date;
}
