/**
 * Declaration status enum
 */
export enum DeclarationStatus {
  DELETED = 0,
  PENDING = 1,
  VALIDATED = 2,
  DECLINED = 3,
  POINTS_ALLOCATED = 4,
}

/**
 * Declaration source enum
 */
export enum DeclarationSource {
  FORM = 1,
  FILE_UPLOAD = 2,
}

/**
 * Declaration sorting fields
 */
export enum DeclarationSorting {
  NONE = '',
  AMOUNT = 'amount',
  COMPANY_NAME = 'companyName',
  FIRST_NAME = 'firstName',
  ID = 'id',
  OCCURRED_ON = 'dateOfEvent',
  PRODUCT_NAME = 'productName',
  PROGRAM_NAME = 'programName',
  PROGRAM_TYPE = 'programType',
  QUANTITY = 'quantity',
  SOURCE = 'source',
  STATUS = 'status',
  USER = 'user',
  VALIDATED_BY = 'validatedBy',
}

/**
 * Declaration validation operation
 */
export enum DeclarationValidationOperation {
  VALIDATE = 'validate',
  DECLINE = 'decline',
}

/**
 * Sort direction
 */
export enum SortDirection {
  ASC = 'asc',
  DESC = 'desc',
}

/**
 * Declaration interface
 */
export interface IDeclaration {
  id: number;
  programId: number;
  programName?: string;
  programType?: number;
  dateOfEvent: Date | string;
  quantity: number;
  amount?: number;
  status: DeclarationStatus;
  source: DeclarationSource;
  hash?: string; // Required for validation API
  firstName?: string;
  lastName?: string;
  companyName?: string;
  customerReference?: string;
  contractReference?: string;
  productReference?: string;
  productName?: string;
  refereeReference?: string;
  additionalComments?: string;
  productId?: number;
  validatedBy?: string;
  user?: {
    firstName?: string;
    lastName?: string;
    uuid?: string;
  };
  product?: {
    id: number;
    name: string;
  };
  otherProductName?: string;
  proofOfSale?: File | string;
  fields?: string[];
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Declaration form data for creation
 */
export interface IDeclarationFormData {
  programId: number;
  dateOfEvent: Date;
  quantity: number;
  firstName?: string;
  lastName?: string;
  companyName?: string;
  customerReference?: string;
  contractReference?: string;
  productReference?: string;
  refereeReference?: string;
  additionalComments?: string;
  productId?: number;
  amount?: number;
  proofOfSale?: File;
}

/**
 * Declaration search criteria
 */
export interface IDeclarationSearchCriteria {
  platformId?: number;
  programId?: number;
  uuid?: string;
  offset?: number;
  size?: number;
  sortBy?: DeclarationSorting;
  sortDirection?: SortDirection;
}

/**
 * Sortable interface
 */
export interface ISortable {
  sortBy?: string;
  sortDirection?: SortDirection;
}

/**
 * Declaration header configuration
 */
export interface IDeclarationHeader {
  id: string;
  sortBy: DeclarationSorting;
  isNotSortable?: boolean;
}

/**
 * Declaration note
 */
export interface IDeclarationNote {
  id: number;
  text: string;
  createdAt: string;
  createdBy?: string;
}

/**
 * Declaration reducer state
 */
export interface IDeclarationsState {
  declarations: IDeclaration[];
  selectedDeclaration: IDeclaration | null;
  listSorting: ISortable | undefined;
  isLoading: boolean;
  hasMore: boolean;
  total: number;
  error: string | null;
}
