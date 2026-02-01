import { USER_IMAGE_TYPE } from '@/constants/personalInformation';

/**
 * File upload interface
 */
export interface IFileUpload {
  file: File | Blob;
  filename: string;
  type: USER_IMAGE_TYPE;
}
