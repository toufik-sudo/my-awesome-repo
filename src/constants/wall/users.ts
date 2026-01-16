import { USER_DECLARATIONS_SORTING, POINT_CONVERSIONS_SORTING } from 'constants/api/declarations';

export const FILE = 'file';
export const EMAIL = 'email';
export const ALL_USERS = 'allusers';
export const INVITE_EMAIL_LIMIT = 10;

export const USER_DECLARATION_HEADERS = Object.freeze([
  {
    id: 'source',
    sortBy: USER_DECLARATIONS_SORTING.SOURCE
  },
  {
    id: 'id',
    sortBy: USER_DECLARATIONS_SORTING.ID
  },
  {
    id: 'programName',
    sortBy: USER_DECLARATIONS_SORTING.PROGRAM_NAME
  },
  {
    id: 'programType',
    sortBy: USER_DECLARATIONS_SORTING.PROGRAM_TYPE
  },
  {
    id: 'occurredOn',
    sortBy: USER_DECLARATIONS_SORTING.OCCURRED_ON
  },
  {
    id: 'declarant',
    sortBy: USER_DECLARATIONS_SORTING.USER
  },
  {
    id: 'customerCompany',
    sortBy: USER_DECLARATIONS_SORTING.COMPANY_NAME
  },
  {
    id: 'target',
    sortBy: USER_DECLARATIONS_SORTING.FIRST_NAME
  },
  {
    id: 'product',
    sortBy: USER_DECLARATIONS_SORTING.PRODUCT_NAME
  },
  {
    id: 'quantity',
    sortBy: USER_DECLARATIONS_SORTING.QUANTITY
  },
  {
    id: 'amount',
    sortBy: USER_DECLARATIONS_SORTING.AMOUNT
  },
  {
    id: 'status',
    sortBy: USER_DECLARATIONS_SORTING.STATUS
  },
  {
    id: 'by',
    sortBy: USER_DECLARATIONS_SORTING.VALIDATED_BY
  }
]);

export const POINT_CONVERSION_HEADERS = [
  
  {
    field: 'superplatformName',
    headerName: 'wall.pointConversions.superplatformName',
    pinned: 'left',
    
  },
  {
    field: 'platformName',
    headerName: 'wall.pointConversions.platformName',
    pinned: 'left',
    
  },
  {
    field: 'programName',
    headerName: 'wall.pointConversions.programName',
    pinned: 'left',
    
  },
  {
    field: 'company',
    headerName: 'wall.pointConversions.company',
    pinned: 'left',
    
  },
  {
    field: 'name',
    headerName: 'wall.pointConversions.name',
    pinned: 'left',
    minWidth: 180,
    maxWidth : 200
    
  },
  {
    field: 'points',
    headerName: 'wall.pointConversions.points',
    pinned: 'left',
    minWidth: 100,
    maxWidth : 120
  },
  {
    field: 'amount',
    headerName: 'wall.pointConversions.amount',
    pinned: 'left',
    minWidth: 100,
    maxWidth : 120
  },
  {
    field: 'email',
    headerName: 'wall.pointConversions.email',
    minWidth : 200,
    maxWidth : 220
    
  },
  {
    field: 'phone',
    headerName: 'wall.pointConversions.phone',
    minWidth : 180,
    maxWidth : 200
    
  },
  {
    field: 'brandName',
    headerName: 'wall.pointConversions.brandName',
    minWidth : 150,
    maxWidth : 180
  },
  {
    field: 'productToken',
    headerName: 'wall.pointConversions.productToken',
    minWidth : 250,
    maxWidth : 300
  },  
  {
    field: 'currency',
    headerName: 'wall.pointConversions.currency',
    
  },
  {
    field: 'createdAt',
    headerName: 'wall.pointConversions.createdAt',
    minWidth : 180,
    maxWidth : 200
    
  },
  {
    field: 'updatedAt',
    headerName: 'wall.pointConversions.updatedAt',
    minWidth : 180,
    maxWidth : 200
  },
  {
    field: 'orderUuid',
    headerName: 'wall.pointConversions.orderUuid',
    minWidth : 250,
    maxWidth : 300
  },    
  {
    field: 'transactionRefId',
    headerName: 'wall.pointConversions.transactionRefId',
    minWidth : 250,
    maxWidth : 300
  },
  {
    field: 'userUuid',
    headerName: 'wall.pointConversions.userUuid',
    minWidth : 150,
    maxWidth : 180
  },
  {
    field: 'errorCode',
    headerName: 'wall.pointConversions.errorCode',
    
  },
  {
    field: 'errorMessage',
    headerName: 'wall.pointConversions.errorMessage',
    minWidth : 250,
    maxWidth : 300
  },
  {
    field: 'statusName',
    headerName: 'wall.pointConversions.status',
    
  }
];

export const BENEFICIARY_DECLARATION_HEADERS = [
  {
    id: 'programName',
    sortBy: USER_DECLARATIONS_SORTING.PROGRAM_NAME
  },
  {
    id: 'programType',
    sortBy: USER_DECLARATIONS_SORTING.PROGRAM_TYPE
  },
  {
    id: 'occurredOn',
    sortBy: USER_DECLARATIONS_SORTING.OCCURRED_ON
  },
  {
    id: 'product',
    sortBy: USER_DECLARATIONS_SORTING.PRODUCT_NAME,
    isNotSortable: true
  },
  {
    id: 'quantity',
    sortBy: USER_DECLARATIONS_SORTING.QUANTITY
  },
  {
    id: 'amount',
    sortBy: USER_DECLARATIONS_SORTING.AMOUNT
  },
  {
    id: 'declarationForm',
    sortBy: USER_DECLARATIONS_SORTING.NONE,
    isNotSortable: true
  },
  {
    id: 'status',
    sortBy: USER_DECLARATIONS_SORTING.STATUS
  }
];


export const BENEFICIARY_DECLARATION_HEADERS_SPONSORSHIP = [
  {
    id: 'programName',
    sortBy: USER_DECLARATIONS_SORTING.PROGRAM_NAME
  },
  {
    id: 'programType',
    sortBy: USER_DECLARATIONS_SORTING.PROGRAM_TYPE
  },
  {
    id: 'occurredOn',
    sortBy: USER_DECLARATIONS_SORTING.OCCURRED_ON
  },
  {
    id: 'product',
    sortBy: USER_DECLARATIONS_SORTING.PRODUCT_NAME,
    isNotSortable: true
  },
  {
    id: 'declarationForm',
    sortBy: USER_DECLARATIONS_SORTING.NONE,
    isNotSortable: true
  },
  {
    id: 'status',
    sortBy: USER_DECLARATIONS_SORTING.STATUS
  }
];


export const BDC_DEMAND_HEADERS = [
  
  {
    field: 'username',
    headerName: 'wall.pointConversions.username',
    pinned: 'left',
    minWidth: 180,
    maxWidth : 200
  },
  {
    field: 'email',
    headerName: 'wall.pointConversions.email',
    pinned: 'left',
    minWidth: 180,
    maxWidth : 200
    
  },  
  {
    field: 'companyName',
    headerName: 'wall.pointConversions.companyName',
    pinned: 'left',
    
  },
  {
    field: 'companyIban',
    headerName: 'wall.pointConversions.companyIban',
    pinned: 'left',
    minWidth: 180,
    maxWidth : 200
    
  },  
  {
    field: 'bdcId',
    headerName: 'wall.pointConversions.bdcId',
    pinned: 'left',
    minWidth: 180,
    maxWidth : 220
  },
  {
    field: 'bdcAmount',
    headerName: 'wall.pointConversions.amount',
    pinned: 'left',
    minWidth: 100,
    maxWidth : 120
  },
  {
    field: 'bdcWins',
    headerName: 'wall.pointConversions.bdcWins',
    pinned: 'left',
    minWidth : 100,
    maxWidth : 120
    
  },
  {
    field: 'bdcDate',
    headerName: 'wall.pointConversions.bdcDate',
    minWidth : 180,
    maxWidth : 200
    
  },
  {
    field: 'statusName',
    headerName: 'wall.pointConversions.status',
    
  },
  {
    field: 'bdcDateExp',
    headerName: 'wall.pointConversions.bdcDateExp',
    minWidth : 150,
    maxWidth : 180
  },
  {
    field: 'invoiceId',
    headerName: 'wall.pointConversions.invoiceId',
    minWidth : 150,
    maxWidth : 180
  },  
  {
    field: 'invoiceDate',
    headerName: 'wall.pointConversions.invoiceDate',
    minWidth : 150,
    maxWidth : 180
  },
  {
    field: 'companySiretSiren',
    headerName: 'wall.pointConversions.companySiretSiren',
    minWidth: 180,
    maxWidth : 240
  },
  {
    field: 'phoneNumber',
    headerName: 'wall.pointConversions.phone',
    minWidth: 150,
    maxWidth : 200
  },
  {
    field: 'bdcPdf',
    headerName: 'wall.pointConversions.bdcPdf',
    minWidth : 150,
    maxWidth : 180
  },
  {
    field: 'invoicePdf',
    headerName: 'wall.pointConversions.invoicePdf',
    minWidth : 150,
    maxWidth : 180
  },
  {
    field: 'userUuid',
    headerName: 'wall.pointConversions.userUuid',
    minWidth : 100,
    maxWidth : 120
  },
  {
    field: 'errorCode',
    headerName: 'wall.pointConversions.errorCode',
    minWidth : 100,
    maxWidth : 120
  },
  {
    field: 'errorMsg',
    headerName: 'wall.pointConversions.errorMessage',
    minWidth : 250,
    maxWidth : 300
  },  
  {
    field: 'comment',
    headerName: 'wall.pointConversions.comment',
    minWidth : 250,
    maxWidth : 300
  }
];

export const FINISHED = 'finished';
export const ONGOING = 'ongoing';
export const PENDING = 'pending';

export const USER_DATA_EXPORT_FILE_PARAM = 2;
export const USER_DATA_EXPORT_FILE_NAME = 'rewardzai_data-export.xls';
