import { DeclarationSorting, SortDirection, IDeclarationHeader, ISortable } from '../types';

/**
 * Default sorting configuration for declarations
 */
export const DECLARATIONS_DEFAULT_SORT: ISortable = Object.freeze({
  sortBy: DeclarationSorting.OCCURRED_ON,
  sortDirection: SortDirection.DESC,
});

/**
 * Default page size for declaration lists
 */
export const DEFAULT_DECLARATIONS_PAGE_SIZE = 20;

/**
 * Admin declaration headers
 */
export const DECLARATION_HEADERS: IDeclarationHeader[] = [
  { id: 'source', sortBy: DeclarationSorting.SOURCE },
  { id: 'id', sortBy: DeclarationSorting.ID },
  { id: 'programName', sortBy: DeclarationSorting.PROGRAM_NAME },
  { id: 'programType', sortBy: DeclarationSorting.PROGRAM_TYPE },
  { id: 'occurredOn', sortBy: DeclarationSorting.OCCURRED_ON },
  { id: 'declarant', sortBy: DeclarationSorting.USER },
  { id: 'customerCompany', sortBy: DeclarationSorting.COMPANY_NAME },
  { id: 'target', sortBy: DeclarationSorting.FIRST_NAME },
  { id: 'product', sortBy: DeclarationSorting.PRODUCT_NAME },
  { id: 'quantity', sortBy: DeclarationSorting.QUANTITY },
  { id: 'amount', sortBy: DeclarationSorting.AMOUNT },
  { id: 'status', sortBy: DeclarationSorting.STATUS },
  { id: 'by', sortBy: DeclarationSorting.VALIDATED_BY },
];

/**
 * Beneficiary declaration headers
 */
export const BENEFICIARY_DECLARATION_HEADERS: IDeclarationHeader[] = [
  { id: 'programName', sortBy: DeclarationSorting.PROGRAM_NAME },
  { id: 'programType', sortBy: DeclarationSorting.PROGRAM_TYPE },
  { id: 'occurredOn', sortBy: DeclarationSorting.OCCURRED_ON },
  { id: 'product', sortBy: DeclarationSorting.PRODUCT_NAME, isNotSortable: true },
  { id: 'quantity', sortBy: DeclarationSorting.QUANTITY },
  { id: 'amount', sortBy: DeclarationSorting.AMOUNT },
  { id: 'declarationForm', sortBy: DeclarationSorting.NONE, isNotSortable: true },
  { id: 'status', sortBy: DeclarationSorting.STATUS },
];

/**
 * Sponsorship declaration headers (no quantity/amount)
 */
export const SPONSORSHIP_DECLARATION_HEADERS: IDeclarationHeader[] = [
  { id: 'programName', sortBy: DeclarationSorting.PROGRAM_NAME },
  { id: 'programType', sortBy: DeclarationSorting.PROGRAM_TYPE },
  { id: 'occurredOn', sortBy: DeclarationSorting.OCCURRED_ON },
  { id: 'product', sortBy: DeclarationSorting.PRODUCT_NAME, isNotSortable: true },
  { id: 'declarationForm', sortBy: DeclarationSorting.NONE, isNotSortable: true },
  { id: 'status', sortBy: DeclarationSorting.STATUS },
];

/**
 * Proof file constraints
 */
export const PROOF_FILE_MAX_SIZE_MB = 10;
export const PROOF_FILE_ACCEPTED_EXTENSIONS = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'jpg', 'png'];

/**
 * Declaration upload constraints
 */
export const DECLARATION_UPLOAD_MAX_SIZE_MB = 10;
export const DECLARATION_UPLOAD_ACCEPTED_TYPES = ['csv', 'xls', 'xlsx'];

/**
 * Error codes for declarations
 */
export const DECLARATION_ERROR_CODES = Object.freeze({
  USER_DECLARATION_CHANGED: 1018,
  PROOF_FILE_LARGE: 1011,
  PROOF_FILE_INVALID_TYPE: 1010,
  UPLOAD_FILE_INVALID_COLUMNS: 1008,
  UPLOAD_FILE_INVALID_ROWS: 1009,
  UPLOAD_FILE_INVALID_TYPE: 1010,
  UPLOAD_FILE_LARGE: 1011,
  UPLOAD_FILE_DUPLICATE_VALUE: 1013,
  UPLOAD_FILE_INVALID_HEADER: 1014,
});

/**
 * Status color mapping using design system tokens
 */
export const STATUS_STYLES: Record<number, { className: string; messageId: string }> = {
  [1]: { className: 'text-yellow-600 bg-yellow-50', messageId: 'declarations.status.pending' },
  [2]: { className: 'text-green-600 bg-green-50', messageId: 'declarations.status.validated' },
  [3]: { className: 'text-destructive bg-destructive/10', messageId: 'declarations.status.declined' },
  [4]: { className: 'text-primary bg-primary/10', messageId: 'declarations.status.allocated' },
};
