// -----------------------------------------------------------------------------
// File Services
// Migrated from old_app/src/services/FileServices.ts
// -----------------------------------------------------------------------------

import { base64ImageToBlob } from '@/utils/general';
import { USER_IMAGE_TYPE } from '@/constants/personalInformation';
import { IMAGE_FORM_DATA_FIELDS } from '@/constants/files';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface AvatarConfig {
  zoom: number;
  rotate: number;
  name: string;
}

// -----------------------------------------------------------------------------
// FormData Utilities
// -----------------------------------------------------------------------------

/**
 * Create an array FormData used to handle image type
 */
export const fileToFormDataArray = (
  fieldsData: unknown[][], 
  fieldsName: string[]
): FormData => {
  const bodyFormData = new FormData();

  fieldsName.forEach((field, fieldIndex) => {
    const fieldData = fieldsData[fieldIndex];
    if (Array.isArray(fieldData)) {
      fieldData.forEach((data, index) => {
        bodyFormData.append(`data[${index}][${field}]`, data as any);
      });
    }
  });

  return bodyFormData;
};

/**
 * Create a simple form data with given fields
 */
export const fileToFormData = (
  fieldsData: unknown[], 
  fieldsName: string[]
): FormData => {
  const bodyFormData = new FormData();
  fieldsName.forEach((field, index) => {
    bodyFormData.append(field, fieldsData[index] as any);
  });

  return bodyFormData;
};

/**
 * Create FormData for avatar upload
 */
export const fileToAvatarFormData = async (
  avatar: string, 
  config: AvatarConfig, 
  imageType: number | string = USER_IMAGE_TYPE.DESIGN_IMAGE
): Promise<FormData> => {
  const fullImageFile = await base64ImageToBlob(avatar);
  return fileToFormDataArray(
    [[fullImageFile], [config.name], [String(imageType)]], 
    IMAGE_FORM_DATA_FIELDS
  );
};

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
 * Check if file is a document
 */
export const isDocumentFile = (filename: string): boolean => {
  const docExtensions = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt'];
  return docExtensions.includes(getFileExtension(filename));
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
