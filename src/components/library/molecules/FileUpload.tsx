// -----------------------------------------------------------------------------
// FileUpload Molecule Component
// Drag and drop file upload with preview
// -----------------------------------------------------------------------------

import React, { useCallback, useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Upload, X, File, Image, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FileUploadProps {
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in bytes
  maxFiles?: number;
  onChange?: (files: File[]) => void;
  onError?: (error: string) => void;
  className?: string;
  disabled?: boolean;
  value?: File[];
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const getFileIcon = (type: string) => {
  if (type.startsWith('image/')) return Image;
  if (type.includes('pdf') || type.includes('document')) return FileText;
  return File;
};

const FileUpload: React.FC<FileUploadProps> = ({
  accept,
  multiple = false,
  maxSize = 10 * 1024 * 1024, // 10MB default
  maxFiles = 10,
  onChange,
  onError,
  className,
  disabled = false,
  value = [],
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<File[]>(value);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateFiles = useCallback(
    (newFiles: File[]): File[] => {
      const validFiles: File[] = [];

      for (const file of newFiles) {
        // Check file size
        if (file.size > maxSize) {
          onError?.(`${file.name} exceeds maximum size of ${formatFileSize(maxSize)}`);
          continue;
        }

        // Check max files
        if (files.length + validFiles.length >= maxFiles) {
          onError?.(`Maximum of ${maxFiles} files allowed`);
          break;
        }

        validFiles.push(file);
      }

      return validFiles;
    },
    [files.length, maxFiles, maxSize, onError]
  );

  const handleFiles = useCallback(
    (newFiles: FileList | null) => {
      if (!newFiles) return;

      const fileArray = Array.from(newFiles);
      const validFiles = validateFiles(fileArray);

      if (validFiles.length > 0) {
        const updatedFiles = multiple ? [...files, ...validFiles] : validFiles;
        setFiles(updatedFiles);
        onChange?.(updatedFiles);
      }
    },
    [files, multiple, onChange, validateFiles]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (!disabled) {
        handleFiles(e.dataTransfer.files);
      }
    },
    [disabled, handleFiles]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleRemove = useCallback(
    (index: number) => {
      const updatedFiles = files.filter((_, i) => i !== index);
      setFiles(updatedFiles);
      onChange?.(updatedFiles);
    },
    [files, onChange]
  );

  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className={cn('w-full', className)}>
      {/* Drop zone */}
      <div
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={cn(
          'flex min-h-[150px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors',
          isDragging
            ? 'border-primary bg-primary/5'
            : 'border-muted-foreground/25 hover:border-primary/50',
          disabled && 'cursor-not-allowed opacity-50'
        )}
      >
        <Upload className="mb-4 h-10 w-10 text-muted-foreground" />
        <p className="mb-1 text-sm font-medium">
          Drop files here or click to upload
        </p>
        <p className="text-xs text-muted-foreground">
          {accept ? `Accepted: ${accept}` : 'All file types accepted'}
          {' • '}
          Max {formatFileSize(maxSize)}
        </p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={(e) => handleFiles(e.target.files)}
        className="hidden"
        disabled={disabled}
      />

      {/* File list */}
      {files.length > 0 && (
        <ul className="mt-4 space-y-2">
          {files.map((file, index) => {
            const Icon = getFileIcon(file.type);
            return (
              <li
                key={`${file.name}-${index}`}
                className="flex items-center gap-3 rounded-md border bg-muted/30 p-3"
              >
                <Icon className="h-8 w-8 shrink-0 text-muted-foreground" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(file.size)}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0"
                  onClick={() => handleRemove(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export { FileUpload, formatFileSize };
export default FileUpload;
