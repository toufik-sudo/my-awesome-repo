const envConfig = {
  backendUrl: process.env.REACT_APP_BACKEND_URL || '',
  backendApiUrl: process.env.REACT_API_HUURAY_URL || '',
  onboarding: {
    rulesUrl: process.env.REACT_APP_ONBOARDING_RULES_URL || '',
    legalUrlEn: process.env.REACT_APP_ONBOARDING_LEGAL_URL_EN || '',
    legalUrlFr: process.env.REACT_APP_ONBOARDING_LEGAL_URL_FR || '',
    contactUrl: process.env.REACT_APP_ONBOARDING_CONTACT_URL || '',
    moreInfoUrl: process.env.REACT_APP_ONBOARDING_MORE_INFO_URL || '',
    whoWeAreUrl: process.env.REACT_APP_ONBOARDING_WHO_WE_ARE_URL || '',
    getHelpUrl: process.env.REACT_APP_ONBOARDING_GET_HELP_URL || '',
    workForUsUrl: process.env.REACT_APP_ONBOARDING_WORK_FOR_US_URL || '',
    contactUsUrl: process.env.REACT_APP_ONBOARDING_CONTACT_US_URL || '',
    blogUrl: process.env.REACT_APP_ONBOARDING_BLOG_URL || ''
  },
  termsAndConditions: {
    baseUrl: process.env.REACT_APP_TC_BASE_URL || 'https://s3.eu-west-3.amazonaws.com/cr-dev-tc/v',
    admin: process.env.REACT_APP_ADMIN_TC_VERSION || '1.0',
    freemium: process.env.REACT_APP_FREEMIUM_TC_VERSION || '1.0',
    launch: process.env.REACT_APP_LAUNCH_TC_VERSION || '1.0'
  },
  zoneUrl: {
    US: process.env.REACT_APP_ZONE_US || 'https://www.us.rewardzai.com',
    Europe: process.env.REACT_APP_ZONE_EUROPE || 'https://www.rewardzai.com'
  }
};

export default envConfig;
