// -----------------------------------------------------------------------------
// Posts Services
// Migrated from old_app/src/services/posts/postsServices.ts
// -----------------------------------------------------------------------------

import { POST_CONFIDENTIALITY_TYPES } from '@/constants/wall/posts';

export interface IConfidentialityOption {
  type: number;
  label: string;
  icon?: string;
}

/**
 * Returns confidentiality options for posts
 */
export const getConfidentialityOnlyOptions = (): IConfidentialityOption[] => [
  {
    type: POST_CONFIDENTIALITY_TYPES.ME_ONLY,
    label: 'wall.posts.confidentiality.meOnly',
    icon: 'lock'
  },
  {
    type: POST_CONFIDENTIALITY_TYPES.PROGRAM_USERS,
    label: 'wall.posts.confidentiality.programUsers',
    icon: 'users'
  },
  {
    type: POST_CONFIDENTIALITY_TYPES.SPECIFIC_PEOPLE,
    label: 'wall.posts.confidentiality.specificPeople',
    icon: 'user-check'
  }
];

/**
 * Returns all confidentiality options including delete
 */
export const getConfidentialityOptions = (): IConfidentialityOption[] => [
  ...getConfidentialityOnlyOptions(),
  {
    type: POST_CONFIDENTIALITY_TYPES.DELETE,
    label: 'wall.posts.confidentiality.delete',
    icon: 'trash'
  }
];
