// -----------------------------------------------------------------------------
// Environment Configuration
// Migrated from old_app/src/config/envConfig.ts
// Fixed to use VITE_APP_ prefix matching .env file
// -----------------------------------------------------------------------------

const envConfig = {
  backendUrl: import.meta.env.VITE_APP_BACKEND_URL || '',
  backendApiUrl: import.meta.env.VITE_APP_HUURAY_URL || '',
  backendHostUrl: import.meta.env.VITE_APP_BACKEND_HOST_URL || '',
  onboarding: {
    rulesUrl: import.meta.env.VITE_APP_ONBOARDING_RULES_URL || '',
    legalUrlEn: import.meta.env.VITE_APP_ONBOARDING_LEGAL_URL_EN || '',
    legalUrlFr: import.meta.env.VITE_APP_ONBOARDING_LEGAL_URL_FR || '',
    contactUrl: import.meta.env.VITE_APP_ONBOARDING_CONTACT_URL || '',
    moreInfoUrl: import.meta.env.VITE_APP_ONBOARDING_MORE_INFO_URL || '',
    whoWeAreUrl: import.meta.env.VITE_APP_ONBOARDING_WHO_WE_ARE_URL || '',
    getHelpUrl: import.meta.env.VITE_APP_ONBOARDING_GET_HELP_URL || '',
    workForUsUrl: import.meta.env.VITE_APP_ONBOARDING_WORK_FOR_US_URL || '',
    contactUsUrl: import.meta.env.VITE_APP_ONBOARDING_CONTACT_US_URL || '',
    blogUrl: import.meta.env.VITE_APP_ONBOARDING_BLOG_URL || ''
  },
  termsAndConditions: {
    baseUrl: import.meta.env.VITE_APP_TC_BASE_URL || 'https://s3.eu-west-3.amazonaws.com/cr-dev-tc/v',
    admin: import.meta.env.VITE_APP_ADMIN_TC_VERSION || '1.0',
    freemium: import.meta.env.VITE_APP_FREEMIUM_TC_VERSION || '1.0',
    launch: import.meta.env.VITE_APP_LAUNCH_TC_VERSION || '1.0'
  },
  zoneUrl: {
    US: import.meta.env.VITE_APP_ZONE_US || 'https://www.us.rewardzai.com',
    Europe: import.meta.env.VITE_APP_ZONE_EUROPE || 'https://www.rewardzai.com'
  },
  zone: import.meta.env.VITE_APP_ZONE || 'EU',
  version: import.meta.env.VITE_APP_VERSION || '1.0',
  mobileBlock: {
    googlePlay: import.meta.env.VITE_APP_MOBILE_BLOCK_GOOGLE_PLAY || '',
    appStore: import.meta.env.VITE_APP_MOBILE_BLOCK_APP_STORE || ''
  },
  rag: {
    url: import.meta.env.VITE_APP_RAG_URL || '',
    useAnthropicConvert: import.meta.env.VITE_APP_RAG_USE_ANTHROPIC_CONVERT === 'True'
  },
  tts: {
    url: import.meta.env.VITE_APP_TTS_URL || '',
    isAudioOn: import.meta.env.VITE_APP_IS_AUDIO_ON === 'true',
    sampleRate: parseInt(import.meta.env.VITE_APP_SAMPLE_RATE || '24000'),
    channels: parseInt(import.meta.env.VITE_APP_CHANNELS || '1'),
    chunkSize: parseInt(import.meta.env.VITE_APP_CHUNK_SIZE || '2048'),
    outputChunkSize: parseInt(import.meta.env.VITE_APP_OUTPUT_CHUNK_SIZE || '4096'),
    workletChunkSize: parseInt(import.meta.env.VITE_APP_WORKLET_CHUNK_SIZE || '1024'),
    minBufferSize: parseInt(import.meta.env.VITE_APP_MIN_BUFFER_SIZE || '2'),
    maxBufferSize: parseInt(import.meta.env.VITE_APP_MAX_BUFFER_SIZE || '40')
  },
  stripe: {
    publishableKey: import.meta.env.VITE_APP_STRIPE_PUBLISHABLE_KEY || '',
    programList: import.meta.env.VITE_APP_STRIPE_PROGRAM_LIST || '[]'
  }
};

export default envConfig;
