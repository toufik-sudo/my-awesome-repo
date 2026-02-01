// -----------------------------------------------------------------------------
// Wall Block Constants
// Migrated from old_app/src/constants/wall/blocks.ts
// -----------------------------------------------------------------------------

export const CONTACT_BLOCK = {
  title: 'wall.contactUs.title',
  content: {
    first: 'wall.contactUs.content.first',
    second: 'wall.contactUs.content.second'
  },
  url: {
    cta: 'wall.contactUs.cta',
    link: import.meta.env.VITE_APP_ZONE === 'US'
      ? 'https://zsp61ubrh2i.typeform.com/to/ZNgpVbHw'
      : 'https://zsp61ubrh2i.typeform.com/to/kNgfGhDI'
  }
};

export const FAQ_BLOCK = {
  title: 'wall.faq.title',
  content: {
    first: 'wall.faq.content.first',
    second: 'wall.faq.content.second'
  },
  url: {
    cta: 'wall.faq.url.cta',
    link: `https://www.rewardzai.com/${import.meta.env.VITE_APP_ZONE === 'EU' ? 'fr' : ''}`
  }
};

export const WALL_BLOCK = {
  USER_BLOCK: 'USER_BLOCK',
  POINTS_BLOCK: 'POINTS_BLOCK',
  DECLARATIONS_BLOCK: 'DECLARATIONS_BLOCK',
  PAYMENT_BLOCK: 'PAYMENT_BLOCK',
  SETTINGS_BLOCK: 'SETTINGS_BLOCK',
  IMAGES_IDS: 'IMAGES_IDS'
} as const;

export type WallBlockType = typeof WALL_BLOCK[keyof typeof WALL_BLOCK];
