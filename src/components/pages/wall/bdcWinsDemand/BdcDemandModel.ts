export type companyModelApi ={
    name: string;
    role: string;
    iban: string;
    bic: string;
    siretSiren: string;
    address: string;
    city: string;
    country: string;
    zipcode: string;
    phoneNumber: string;
    fax?: string;
    email: string;
    pole?: string;
    activity?: string;
    others?: string;
    isIbanSetted? : string 
}

export type wallletCompanyModelApi ={
    wins: number;
    amount: number;
    expireDate?: string;
    isSepa?: string;
    sepaDueDate?: string;
    comments?: string;
}

export type BdcDemandModelApi ={
    data : {
        company: companyModelApi,
        wallletCompany: wallletCompanyModelApi,
    }
}

export type engLgCatalogueList ={
    id_catalogue: number;
    observation: string;
    num_ligne: number;
    prix: string;
    quantite: number;
    is_prix_supplementaire_pourcentage: boolean;
    prix_supplementaire: number;
    prix_supplementaire_pourcentage: number;
}
export type ErpModelSetBdcApi ={
    reference: string;
    libelle: string;
    date_debut: string;
    date_fin: string;
    is_tacite_reconduction: boolean;
    is_periode_facture: boolean;
    taux_tva: number;
    etat_solde: string;
    etat_engagement: string;
    exoneration_tva: boolean;
    is_tva_ligne: boolean;
    is_url_cloud: boolean;
    is_facturer: boolean;
    mode_doc_facture: string;
    type_client_commerce: string;
    id_banque: number;
    id_activity: number;
    id_monnaie: number;
    id_client: number;
    id_type_engagement: number;
    id_mode_reglement: number;
    eng_lg_catalogue_list: engLgCatalogueList[]
}
export type setBdcDemandModelApi ={
    platformId: string|number;
    userAdminUuId: string;
    bdcId: string;
    bdcDateExp: string;
    invoiceId: string;
    invoiceDate: string;
    amount: number;
    wins: number;
    companyIban: string;
    companyBic: string;
    companySiretSiren: string;
    status: string;
    comment: string;
    errorCode: string;
    errorMsg: string;
    isUserAcceptDuplicatedAmounts: boolean;
    isBdcSending: boolean;
}

export type getBdcInvoiceParamsApi ={
    userAdminUuId: string;
    userAdminId?: string;
    bdcId?: string;
    invoiceId?: string;
    invoiceDate?: string;
}

export type getBdcInvoiceResponseApi ={
    id : string|number;
    userAdminId : string|number;
    userUuid : string;
    userStatus : string;
    email : string;
    username : string;
    phoneNumber : string;
    mobilePhoneNumber : string;
    companyId : string|number;
    companyName : string;
    companyIban : string;
    companyBic : string;
    companySiretSiren : string;
    bdcId : string;
    bdcAmount : string;
    bdcWins : string;
    bdcDate : string;
    bdcDateExp : string;
    invoiceId : string;
    invoiceDate : string;
    bdcUrl : string;
    bdcPdf : string;
    invoiceUrl : string;
    invoicePdf : string;
    status : string;
    statusName : string;
    errorCode : string;
    errorMsg : string;
    comment : string;
}

export type getBdcInvoiceResponseData ={
    data: getBdcInvoiceResponseApi[];
}

export type ExpiredWinsModelApi ={
    platformId: number;
    platformName?: string;
    expiredWins: number;
}

export type GetExpiredWinsModelApi ={
    data : {
        expiredPlatformWins: ExpiredWinsModelApi[],
        allExpiredWins: number
    }
}

export interface BdcInvoiceOption {
    readonly value?: string;
    readonly label?: string;
    readonly color?: string;
    readonly isFixed?: boolean;
    readonly isDisabled?: boolean;
    readonly isBdcDate?: boolean;
    // readonly isName?: boolean;
    readonly isStatus?: boolean;
    readonly isInvoiceDate?: boolean;
    readonly isUsername?: boolean;
}

export const BDC_DEMAND_STATUS = {
    "PENDING" : "PENDING",
    "IN_PROGRESS" : "IN_PROGRESS",
    "TERMINATED": "TERMINATED",
    "IN_ERROR": "ERROR",
    "CANCELLED": "CANCELLED"
}
export const BDC_DEMAND_DATES = {
    "1W":`1,weeks`,
    "1M":`1,months`,
    "3M":`3,months`,
    "6M":`6,months`,
    "1Y":`1,years`
}