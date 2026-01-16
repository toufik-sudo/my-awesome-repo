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
import UserGrowthRefApi from 'api/UserGrowthRefApi';

const userGrowthRefApi = new UserGrowthRefApi();
const fileRestrictions = getAcceptedDeclarationFileTypesAndSize();
/**
 * Hook used to create a single user declaration.
 */
const useUploadUserGrowthRef = (setIsGrowthRefLoaded, setSelectedProduct) => {
  const intl = useIntl();
  const [declarationGrowthRefFile, setDeclarationGrowthRefFile] = useState<any>();
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
    setDeclarationGrowthRefFile(file);
  }, []);

  const onRemove = useCallback(() => onDrop([]), [onDrop]);

  const fileDropzone = useDropzone({
    onDrop,
    ...fileRestrictions
  });

  const onProductChange = useCallback(product => {
    setSelectedProduct(product);
    setDeclarationGrowthRefFile(undefined);
    setErrors({});
  }, []);

  const onUpload = useCallback(async () => {
    if (!declarationGrowthRefFile) {
      // const productError = REQUIRED;
      const fileError = !declarationGrowthRefFile && REQUIRED;
      setErrors({
        fileError
      });
      return;
    }

    setSubmitting(true);
    try {
      const { totalLines } = await userGrowthRefApi.uploadGrowthRefFiles({
        file: declarationGrowthRefFile,
        filename: declarationGrowthRefFile.name
      });
      onProductChange(null);
      toast(intl.formatMessage({ id: 'wall.userDeclaration.upload.success' }, { uploaded: totalLines || 0 }));
      setIsGrowthRefLoaded(false);
    } catch ({ response }) {
      response.data && setErrors({ uploadResponse: response.data, fileError: extractErrorCode(response) });

      const errorMessage = resolveUserDeclarationCreateErrorMessage(response);
      toast(intl.formatMessage({ id: errorMessage }));
      // setIsGrowthRefLoaded(false);
    }
    setSubmitting(false);
  }, [declarationGrowthRefFile, intl]);

  return {
    onProductChange,
    submitting,
    isValid: !(errors.fileError || errors.uploadResponse),
    errors,
    onUpload,
    fileDropProps: {
      ...fileDropzone,
      ...fileRestrictions,
      ...errors,
      fileUploading: submitting,
      acceptedFiles: declarationGrowthRefFile ? [declarationGrowthRefFile] : [],
      onRemove
    }
  };
};

export default useUploadUserGrowthRef;
