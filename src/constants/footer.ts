import envConfig from '@/config/envConfig';

export const OUR_STORY = 'ourStory';
export const WHO_WE_ARE = 'whoWeAre';
export const WHERE_WE_ARE = 'whereWeAre';
export const BECOME_PARTNER = 'becomePartner';
export const WORK_FOR_US = 'workForUs';
export const SUPPORT = 'support';
export const LEGAL = 'legal';
export const DATA_PRIVACY = 'dataPrivacy';
export const GET_HELP = 'getHelp';
export const CONTACT_US = 'contactUs';
export const MEDIA = 'media';
export const BLOG = 'blog';

export const SOCIAL_LINKS = {
  FACEBOOK: 'https://www.facebook.com/rewardzai.com',
  INSTAGRAM: 'https://www.instagram.com/rewardzai_ig/',
  LINKEDIN: 'https://www.linkedin.com/company/rewardzai',
  REDDIT: 'https://www.reddit.com/user/rewardzai/',
  YOUTUBE: 'https://www.youtube.com/channel/UCoACiyERIzUJBXEBhMQ079g/',
  TWITTER: 'https://twitter.com/rewardzai.com',
  PINTEREST: 'https://www.pinterest.fr/rewardzai.com/'
};

export const FOOTER_URL_LINKS = [
  [
    { title: OUR_STORY },
    { title: WHO_WE_ARE },
    { title: WHERE_WE_ARE, link: envConfig.onboarding?.whoWeAreUrl },
    { title: BECOME_PARTNER },
    { title: WORK_FOR_US, link: envConfig.onboarding?.workForUsUrl }
  ],
  [
    { title: SUPPORT },
    { title: LEGAL, link: envConfig.onboarding?.legalUrlEn },
    { title: DATA_PRIVACY },
    { title: GET_HELP, link: envConfig.onboarding?.getHelpUrl },
    { title: CONTACT_US, link: envConfig.onboarding?.contactUsUrl }
  ],
  [
    { title: MEDIA },
    { title: BLOG, link: envConfig.onboarding?.blogUrl }
  ]
];
