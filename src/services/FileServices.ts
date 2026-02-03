// -----------------------------------------------------------------------------
// File Services
// Unified image upload for launch steps using /file/upload and correct payload/types
// -----------------------------------------------------------------------------

import { base64ImageToBlob } from '@/utils/general';
import { IMAGE_FORM_DATA_FIELDS } from '@/constants/files';

// Image type codes for launch
export const LAUNCH_IMAGE_TYPES = {
  USER_PROFILE_PICTURE: 1,
  USER_CROPPED_PROFILE_PICTURE: 2,
  PRODUCT_IMAGE: 3,
  EMAIL_TEMPLATE_IMAGE: 4,
  PROGRAM_IMAGE: 5,
  DESIGN_IMAGE: 6,
  PAGE_IMAGE: 7,
  SLIDE_IMAGE: 8,
  FILE_TYPE_PROFILE_IMAGE: 1,
  FILE_TYPE_CSV: 1,
  FILE_TYPE_XLS: 2,
  FILE_POST_IMAGE: 9,
  FILE_POST_VIDEO: 10,
  FILE_POST_OTHERS: 11,
  FILE_COMMENT_IMAGE: 12,
  FILE_COMMENT_VIDEO: 13,
  FILE_COMMENT_OTHERS: 14,
  PROOF_FILE: 15,
  TERMS_AND_CONDITIONS: 16,
};

export interface AvatarConfig {
  zoom: number;
  rotate: number;
  name: string;
}

/**
 * Create FormData for image upload for launch program
 * Always uses type number (see LAUNCH_IMAGE_TYPES)
 */
export async function createLaunchImageFormData(
  fileOrBase64: File | string,
  filename: string,
  type: number
): Promise<FormData> {
  let file: File | Blob = fileOrBase64;
  if (typeof fileOrBase64 === 'string' && fileOrBase64.startsWith('data:')) {
    file = await base64ImageToBlob(fileOrBase64);
  }
  const formData = new FormData();
  formData.append('data[0][file]', file);
  formData.append('data[0][filename]', filename);
  formData.append('data[0][type]', String(type));
  return formData;
}

/**
 * Uploads a launch image, returns the upload response (array of { id, filename, publicPath? })
 * Uses '/file/upload' endpoint
 */
export async function uploadLaunchImage(
  fileOrBase64: File | string,
  filename: string,
  type: number,
  filesApi: { uploadFileToUrl: Function }
): Promise<{ id: number; filename: string; publicPath?: string }[]> {
  const formData = await createLaunchImageFormData(fileOrBase64, filename, type);
  // API endpoint is '/file/upload'
  const url = '/file/upload';
  const { data } = await filesApi.uploadFileToUrl(url, formData);
  return data;
}

/**
 * Get file extension from filename
 */
export const getFileExtension = (filename: string): string => {
  const parts = filename.split('.');
  return parts.length > 1 ? parts.pop()?.toLowerCase() || '' : '';
};

/**
 * Check if file is an image
 */
export const isImageFile = (filename: string): boolean => {
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'];
  return imageExtensions.includes(getFileExtension(filename));
};

/**
 * Generate a unique filename with timestamp
 */
export const generateUniqueFilename = (originalName: string): string => {
  const extension = getFileExtension(originalName);
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `${timestamp}_${random}.${extension}`;
};
