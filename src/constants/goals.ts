// -----------------------------------------------------------------------------
// Goal Configuration Constants
// Constants for rewards goal allocation
// -----------------------------------------------------------------------------

import type { 
  MeasurementTypeOption, 
  AllocationTypeOption, 
  Product,
  GoalAllocation 
} from '@/types/goals';

// Measurement type options as specified: Actions, Chiffre d'affaire (Revenue), Volume
export const MEASUREMENT_TYPE_OPTIONS: MeasurementTypeOption[] = [
  {
    id: 'actions',
    label: 'Actions',
    description: 'Nombre d\'actions réalisées (clics, inscriptions, etc.)'
  },
  {
    id: 'revenue',
    label: 'Chiffre d\'affaire',
    description: 'Montant des ventes en euros'
  },
  {
    id: 'volume',
    label: 'Volume',
    description: 'Quantité de produits vendus'
  }
];

// Allocation type options: Fixed points, Percentage, Brackets
export const ALLOCATION_TYPE_OPTIONS: AllocationTypeOption[] = [
  {
    id: 'fixed',
    label: 'Points fixes',
    description: 'Attribuer un nombre fixe de points par objectif atteint',
    icon: 'target'
  },
  {
    id: 'percentage',
    label: 'Pourcentage',
    description: 'Attribuer un % du montant converti en points',
    icon: 'percent'
  },
  {
    id: 'brackets',
    label: 'Paliers',
    description: 'Points selon des tranches de performance',
    icon: 'layers'
  }
];

// Goal constraints
export const MIN_GOALS = 1;
export const MAX_GOALS = 3;

// General product placeholder
export const GENERAL_PRODUCT: Product = {
  id: 'general',
  name: 'Produit général',
  isGeneral: true
};

// Initial goal state
export const createEmptyGoal = (): GoalAllocation => ({
  productId: '',
  measurementType: null,
  allocationType: null,
  allocationValue: undefined,
  validated: {
    product: false,
    measurementType: false,
    allocationType: false
  }
});

// Default initial state
export const INITIAL_GOALS_STATE = {
  goals: [createEmptyGoal()],
  maxGoals: MAX_GOALS,
  minGoals: MIN_GOALS
};
