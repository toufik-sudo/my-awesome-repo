import { useState, useCallback } from 'react';
import { useIntl } from 'react-intl';
import { toast } from 'react-toastify';
import { useDropzone } from 'react-dropzone';

import UserDeclarationApi from 'api/UserDeclarationsApi';
import {
  resolveUserDeclarationCreateErrorMessage,
  validateDeclarationFile,
  getAcceptedDeclarationFileTypesAndSize
} from 'services/UserDeclarationServices';
import { REQUIRED } from 'constants/validation';
import { extractErrorCode } from 'utils/api';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { platform } from 'os';

const userDeclarationApi = new UserDeclarationApi();
const fileRestrictions = getAcceptedDeclarationFileTypesAndSize();
/**
 * Hook used to create a single user declaration.
 */
const useUploadUserDeclarations = () => {
  const intl = useIntl();
  const [selectedProgram, setSelectedProgram] = useState<any>();
  const [declarationFile, setDeclarationFile] = useState<any>();
  const [errors, setErrors] = useState<any>({});
  const [submitting, setSubmitting] = useState(false);

  const onDrop = useCallback(files => {
    const file = files[0];
    const fileError = validateDeclarationFile(file);

    setErrors(errors => ({
      ...errors,
      uploadResponse: undefined,
      fileError: fileError.error
    }));
    setDeclarationFile(file);
  }, []);

  const onRemove = useCallback(() => onDrop([]), [onDrop]);

  const fileDropzone = useDropzone({
    onDrop,
    ...fileRestrictions
  });

  const onProgramChange = useCallback(program => {
    setSelectedProgram(program);
    setDeclarationFile(undefined);
    setErrors({});
  }, []);

  const onUpload = useCallback(async () => {
    if (!selectedProgram || !declarationFile) {
      const programError = !selectedProgram && REQUIRED;
      const fileError = !declarationFile && REQUIRED;
      setErrors({
        programError,
        fileError
      });
      return;
    }

    setSubmitting(true);
    try {
      const { totalLines } = await userDeclarationApi.uploadDeclarations({
        file: declarationFile,
        filename: declarationFile.name,
        programId: selectedProgram.id
      });
      onProgramChange(null);
      toast(intl.formatMessage({ id: 'wall.userDeclaration.upload.success' }, { uploaded: totalLines || 0 }));
    } catch ({ response }) {
      response.data && setErrors({ uploadResponse: response.data, fileError: extractErrorCode(response) });

      const errorMessage = resolveUserDeclarationCreateErrorMessage(response);
      // if (errorMessage === 'wall.userDeclaration.add.error.general') {
      //   toast(DynamicFormattedMessage('wall.userDeclaration.add.error.general',platformName))
      // }
      toast(intl.formatMessage({ id: errorMessage }));
    }
    setSubmitting(false);
  }, [selectedProgram, declarationFile, onProgramChange, intl]);

  return {
    selectedProgram,
    onProgramChange,
    submitting,
    isValid: !(errors.programError || errors.fileError || errors.uploadResponse),
    errors,
    onUpload,
    fileDropProps: {
      ...fileDropzone,
      ...fileRestrictions,
      ...errors,
      fileUploading: submitting,
      acceptedFiles: declarationFile ? [declarationFile] : [],
      onRemove
    }
  };
};

export default useUploadUserDeclarations;
