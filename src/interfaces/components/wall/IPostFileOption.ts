import { FileType } from 'constants/api';

export interface IPostFileOption {
  label: string;
  type: FileType;
  format: string;
  maxMbSize: number;
  unsupportedExtensions?: string[];
}
