// -----------------------------------------------------------------------------
// Goal Configuration Types
// Types for rewards goal allocation in launch program
// -----------------------------------------------------------------------------

export interface Product {
  id: string;
  name: string;
  imageUrl?: string;
  isGeneral?: boolean;
}

export type MeasurementType = 'actions' | 'revenue' | 'volume';

export interface MeasurementTypeOption {
  id: MeasurementType;
  label: string;
  description: string;
}

export type AllocationType = 'fixed' | 'percentage' | 'brackets';

export interface AllocationTypeOption {
  id: AllocationType;
  label: string;
  description: string;
  icon: string;
}

export interface GoalAllocation {
  productId: string;
  measurementType: MeasurementType | null;
  allocationType: AllocationType | null;
  allocationValue?: {
    min?: number;
    max?: number;
    value?: number;
    brackets?: AllocationBracket[];
  };
  validated: {
    product: boolean;
    measurementType: boolean;
    allocationType: boolean;
  };
}

export interface AllocationBracket {
  min: number;
  max: number;
  value: number;
  status: 'available' | 'disabled';
}

export interface GoalState {
  goals: GoalAllocation[];
  maxGoals: number;
  minGoals: number;
}

// Track which product/measurement combinations are used
export interface UsedCombination {
  productId: string;
  measurementType: MeasurementType;
}

// Context type for goal management
export interface GoalContextType {
  goals: GoalAllocation[];
  products: Product[];
  addGoal: () => void;
  removeGoal: (index: number) => void;
  updateGoal: (index: number, updates: Partial<GoalAllocation>) => void;
  validateGoalField: (index: number, field: keyof GoalAllocation['validated']) => void;
  getDisabledMeasurementTypes: (goalIndex: number, productId: string) => MeasurementType[];
  canAddGoal: boolean;
  canRemoveGoal: boolean;
  isGoalComplete: (index: number) => boolean;
  areAllGoalsComplete: boolean;
}
