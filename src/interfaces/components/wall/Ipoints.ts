export interface IPointsConverion {   
    brandName?: string | null;
    currency?: string | null;
    program?: any | null;
    superplatform?: any | null;
    platform?: any | null;
    status?: number | null;
    name?: string | null;
    email?: string | null;
    phone?: string | null;
    productToken?: string | null;
    points?: string | null;
    amount?: number | null;
    createdAt?: string | null;
    updatedAt?: string | null;
    orderUuid?: string | null;
    transactionRefId?: string | null;
    userUuid?: string | null;
    errorCode?: string | null;
    errorMessage?: string | null;
    superplatformName ?: string | null; 
    superPlatformId ?: string | null; 
    platformName ?: string | null; 
    platformId ?: string | null; 
    statusName ?: string | null;     
    company ?: string | null;     
    programId ?: string | null;     
    programName ?: string | null;     
};

export interface PointsOption {
    readonly value?: string|number|any;
    readonly label?: string;
    readonly color?: string;
    readonly isFixed?: boolean;
    readonly isDisabled?: boolean;
    readonly isBrandName?: boolean;
    // readonly isName?: boolean;
    readonly isStatus?: boolean;
    readonly isPlatform?: boolean;
    readonly isProgram?: boolean;
  }