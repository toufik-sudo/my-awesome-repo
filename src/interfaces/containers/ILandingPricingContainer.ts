import { IArrayKey, TDynamicObject } from 'interfaces/IGeneral';

export interface ILandingPricingRowProps {
  pricingElement: TDynamicObject;
  columnIndex?: number;
}

export interface IPriceObject {
  additionalOptions: IArrayKey<number | null>;
  id: string;
  name: string;
  price: number;
  currency: number;
  nrOfAdmins: null | number;
  nrOfStorytellings: number;
  marketingAutomation: boolean;
  cube: boolean;
  hierarchicLevels: boolean;
  kpi: boolean;
  escrow: boolean;
  automaticBilling: boolean;
  automaticAdditionOfRules: boolean;
  nrOfMarketplacePartners: number;
  prepackagedMarketplaces: boolean;
  unusedBudgetRefund: boolean;
  maxEmailPerMonth: boolean;
  dataExport: boolean;
  archives: boolean;
  maxUsers: number;
  dataStorageCapacity: number;
  cta: number;
  setup: number;
  typeOfPrograms: number;
  frequenciesOfPayment: null;
}
