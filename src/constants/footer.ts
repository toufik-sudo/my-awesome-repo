import envConfig from "../config/envConfig";

import {
  faFacebookF,
  faInstagram,
  faTwitter,
  faLinkedinIn,
  faPinterest,
  faReddit,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";

export const FACEBOOK = faFacebookF;
export const TWITTER = faTwitter;
export const LINKEDIN = faLinkedinIn;
export const REDDIT = faReddit;
export const YOUTUBE = faYoutube;
export const INSTAGRAM = faInstagram;
export const PINTEREST = faPinterest;

export const FACEBOOK_LINK = "https://www.facebook.com/rewardzai.com";
export const INSTAGRAM_LINK = "https://www.instagram.com/rewardzai_ig/";
export const LINKEDIN_LINK = "https://www.linkedin.com/company/rewardzai";
export const REDDIT_LINK = "https://www.reddit.com/user/rewardzai/";
export const YOUTUBE_LINK =
  "https://www.youtube.com/channel/UCoACiyERIzUJBXEBhMQ079g/";
export const TWITTER_LINK = "https://twitter.com/rewardzai.com";
export const PINTEREST_LINK = "https://www.pinterest.fr/rewardzai.com/";

export const SOCIAL_ICONS = [
  { platform: FACEBOOK, url: FACEBOOK_LINK },
  { platform: INSTAGRAM, url: INSTAGRAM_LINK },
  { platform: LINKEDIN, url: LINKEDIN_LINK },
  { platform: REDDIT, url: REDDIT_LINK },
  { platform: YOUTUBE, url: YOUTUBE_LINK },
  { platform: TWITTER, url: TWITTER_LINK },
  { platform: PINTEREST, url: PINTEREST_LINK },
];

export const OUR_STORY = "ourStory";
export const WHO_WE_ARE = "whoWeAre";
export const WHERE_WE_ARE = "whereWeAre";
export const BECOME_PARTNER = "becomePartner";
export const WORK_FOR_US = "workForUs";
export const SUPPORT = "support";
export const LEGAL = "legal";
export const DATA_PRIVACY = "dataPrivacy";
export const GET_HELP = "getHelp";
export const CONTACT_US = "contactUs";
export const MEDIA = "media";
export const BLOG = "blog";

export const FOOTER_URL_LINKS = [
  [
    { title: OUR_STORY },
    { title: WHO_WE_ARE },
    { title: WHERE_WE_ARE, link: envConfig.onboarding.whoWeAreUrl },
    { title: BECOME_PARTNER },
    { title: WORK_FOR_US, link: envConfig.onboarding.workForUsUrl },
  ],
  [
    { title: SUPPORT },
    { title: LEGAL, link: envConfig.onboarding.legalUrlEn },
    { title: DATA_PRIVACY },
    { title: GET_HELP, link: envConfig.onboarding.getHelpUrl },
    { title: CONTACT_US, link: envConfig.onboarding.contactUsUrl },
  ],
  [{ title: MEDIA }, { title: BLOG, link: envConfig.onboarding.blogUrl }],
];
