export interface IFeatureElementProps {
  titleId: string;
  textId: string;
  size?: string;
  position: number;
  boxIndex: number;
  setActiveBox: (index: number) => void;
}
