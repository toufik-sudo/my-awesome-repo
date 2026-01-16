import { PRICING_BLOCK_TYPES } from 'constants/landing';
import { IArrayKey } from 'interfaces/IGeneral';

export interface IPricingPlansBlockProps {
  pricingData: IArrayKey<any>[];
  type?: PRICING_BLOCK_TYPES;
  initialSlide?: number;
  setActiveSlide?: (slide: number) => void;
  columnIndex?: number;
}

export interface IReturnUsePriceData {
  isLoading: boolean;
  pricingData: IArrayKey<any>[];
}
