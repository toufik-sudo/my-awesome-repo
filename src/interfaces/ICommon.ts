export interface INavScrollElementProps {
  title: string;
  id?: string;
  style?: string;
  setActive?: () => void;
  offsetHeight?: number;
  styleCustom?: string;
  closeNav?: () => void;
}
