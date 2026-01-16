
export interface IaiPersoGetResponseApi {
    id?: number; 
    iaProjectId?: string;
    iaType?: string;
    iaName?: string; 
    tone?: string; 
    theValues?: string; 
    favoriteDishes?: string; 
    rhythm?: string; 
    favoriteColor?: string; 
    socialActivities?: string;
    favoriteMusicStyle?: string;  
    favoriteSport?: string;
    sportsTeam?: string; 
    petName?: string; 
    entertainmentPreferences?: string; 
    topThreeFavoriteBooks?: string; 
    favoriteDestination?: string; 
    shortBiography?: string; 
    introductions?: string; 
    universe?: string; 
    expressions?: string; 
    status?: string; 
    comment?: string; 
    iaPersoExpireDate?: string;
    iaPersoDueDate?: string;
    iaPersoLogoUrl?: string;     
    userUuid?: string;     
    iaId?: number;     
  }

export interface IaiTrainingCompanyProgram {
  iaTrainingName?: string;
  iaStatus?: string;
  iaTrainingDueDate?: string;
  iaTrainingExpireDate?: string;
  iaComment?: string;
  iaTrainingType?: string;
  }
export interface IaiCompanyProgram {
    iaName ?: string ;
    iaProjectId ?: string ;
    iaType ?: string ;
    iaComment ?: string ;
    iaExpireDate ?: string ;
    iaDueDate ?: string ;
    iaStatus ?: string ;
    iaTrainingCompany?: IaiTrainingCompanyProgram[];
    iaAudioOn?:boolean
  }

  export interface IaiPersoGetResponseData{
    data: IaiPersoGetResponseApi[];
  }

  export interface IaiPersoPostRequestApi {
    iaId?: number; 
    iaName: string; 
    userUuid: string; 
    tone: string; 
    theValues: string; 
    favoriteDishes: string; 
    rhythm: string; 
    favoriteColor: string; 
    socialActivities: string;
    favoriteMusicStyle: string;  
    favoriteSport: string;
    sportsTeam: string; 
    petName: string; 
    entertainmentPreferences: string; 
    topThreeFavoriteBooks: string; 
    favoriteDestination: string; 
    shortBiography: string; 
    introductions: string; 
    universe: string; 
    expressions: string; 
    status?: string; 
    comment?: string; 
    iaPersoExpireDate?: string;
    iaPersoDueDate?: string;
    iaPersoLogoUrl?: string;  
    isIaPersoUpdate?: boolean;  
  }

  export interface IadminProgram{
    id?: number;
    name?: string;
    iaName?: string;
    iaType?: string;
    companyName?: string;
    programName?: string;
  }

  export interface IGetRagIndexDocsApi{
    categoryToIndex: string;
    filenameToIndex?: string;
    urlToIndex?: string;
    isIndexBlocked: string;
    status: string;
    isCommon: string;
    isIaStar: string;
    comment: string;
    errorCode?: string;
    errorMsg?: string;
    IsIndexReseted: string;
    programId: string;
    programName: string;
    createdAt: string;
    updatedAt: string;
  }