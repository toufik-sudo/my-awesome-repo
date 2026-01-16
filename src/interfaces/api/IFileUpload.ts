import { FileType } from 'constants/api';

export interface IFileUpload {
  file: any;
  filename: string;
  type: FileType;
}
