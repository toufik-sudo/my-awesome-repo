// -----------------------------------------------------------------------------
// Dashboard Constants
// Migrated from old_app/src/constants/wall/dashboard.tsx
// -----------------------------------------------------------------------------

export const PARTICIPANTS = 'participants';
export const RESULTS = 'results';
export const REWARDS = 'rewards';
export const REVENUE = 'revenue';
export const ACTIVE = 'active';
export const PENDING = 'pending';
export const BLOCKED = 'blocked';
export const TOTAL = 'total';
export const VALIDATED = 'validated';
export const DECLINED = 'declined';
export const TOTAL_IN_POINTS = 'totalInPoints';
export const POINT_BUDGET_SO_FAR = 'pointBudgetSoFar';
export const BURNED = 'burned';
export const NOT_BURNED = 'notBurned';
export const EXPIRED = 'expired';
export const PRIMARY_COLOR = 'primary';
export const DANGER_COLOR = 'danger';
export const SECONDARY_COLOR = 'secondary';
export const PERIODS = 'periods';
export const NO_OF_PARTICIPANTS = 'nrOfParticipants';
export const NO_OF_DECLARATIONS = 'nrOfDeclarations';
export const TOTAL_REWARDS_IN_POINTS = 'totalRewardsInPoints';
export const AMOUNT_OF_DECLARATIONS = 'amountOfDeclarations';
export const TOTAL_PROGRAM_TOKENS = 'totalProgramTokens';

export const DASHBOARD_FIELDS = [
  NO_OF_PARTICIPANTS,
  NO_OF_DECLARATIONS,
  TOTAL_REWARDS_IN_POINTS,
  AMOUNT_OF_DECLARATIONS,
  TOTAL_PROGRAM_TOKENS
];

export interface IKPIField {
  name: string;
  relatedDashboardKpi: string;
  fields: string[];
  colors: Record<string, string>;
}

export const KPI_DETAILED_FIELDS: Record<string, IKPIField> = {
  [PARTICIPANTS]: {
    name: PARTICIPANTS,
    relatedDashboardKpi: NO_OF_PARTICIPANTS,
    fields: [ACTIVE, PENDING, BLOCKED],
    colors: { [ACTIVE]: SECONDARY_COLOR, [PENDING]: 'warning', [BLOCKED]: DANGER_COLOR }
  },
  [RESULTS]: {
    name: RESULTS,
    relatedDashboardKpi: NO_OF_DECLARATIONS,
    fields: [TOTAL, VALIDATED, DECLINED],
    colors: { [TOTAL]: PRIMARY_COLOR, [VALIDATED]: 'lightGreen', [DECLINED]: DANGER_COLOR }
  },
  [REWARDS]: {
    name: REWARDS,
    relatedDashboardKpi: TOTAL_REWARDS_IN_POINTS,
    fields: [TOTAL_IN_POINTS, BURNED, NOT_BURNED, EXPIRED],
    colors: {
      [TOTAL_IN_POINTS]: SECONDARY_COLOR,
      [BURNED]: PRIMARY_COLOR,
      [NOT_BURNED]: 'warning',
      [EXPIRED]: DANGER_COLOR
    }
  },
  [REVENUE]: {
    name: REVENUE,
    relatedDashboardKpi: AMOUNT_OF_DECLARATIONS,
    fields: [TOTAL, VALIDATED, DECLINED, POINT_BUDGET_SO_FAR],
    colors: {
      [TOTAL]: SECONDARY_COLOR,
      [VALIDATED]: PRIMARY_COLOR,
      [DECLINED]: DANGER_COLOR,
      [POINT_BUDGET_SO_FAR]: 'warning'
    }
  }
};
