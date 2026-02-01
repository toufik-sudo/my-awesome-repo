// -----------------------------------------------------------------------------
// Posts Services
// Helper functions for post data manipulation
// -----------------------------------------------------------------------------

import { format, parseISO, isValid } from 'date-fns';

export interface IPost {
  id: number;
  title?: string;
  content: string;
  type: number;
  author: {
    firstName?: string;
    lastName?: string;
    croppedPicturePath?: string;
    companyRole?: string;
  };
  file?: {
    url?: string;
    type?: string;
    name?: string;
  };
  nrOfComments: number;
  nrOfLikes: number;
  isLiked?: boolean;
  isPinned?: boolean;
  createdAt: string;
  endDate?: string;
  confidentialityType?: number;
  isAutomatic?: boolean;
  automaticType?: string;
  programs?: Array<{ id: number; name: string }>;
}

export interface IGroupedPosts {
  date: string;
  posts: IPost[];
}

/**
 * Group posts by date for display
 */
export const groupPostsByDate = (posts: IPost[]): IPost[] => {
  // For now, return posts as-is without grouping
  // The original implementation grouped by date but the current UI doesn't require it
  return posts;
};

/**
 * Format post date for display
 */
export const formatPostDate = (dateString: string): string => {
  try {
    const date = parseISO(dateString);
    if (!isValid(date)) {
      return dateString;
    }
    return format(date, 'PPp');
  } catch {
    return dateString;
  }
};

/**
 * Get author display name
 */
export const getAuthorDisplayName = (author: IPost['author']): string => {
  const firstName = author.firstName || '';
  const lastName = author.lastName || '';
  return `${firstName} ${lastName}`.trim() || 'Unknown';
};

/**
 * Get author initials for avatar
 */
export const getAuthorInitials = (author: IPost['author']): string => {
  const first = author.firstName?.charAt(0) || '';
  const last = author.lastName?.charAt(0) || '';
  return `${first}${last}`.toUpperCase() || 'U';
};
